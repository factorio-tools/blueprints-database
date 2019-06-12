import fs from 'fs'
import { RelyingParty } from 'openid'
import { Application, Response, RequestHandler, Request } from 'express'
import { JWK, JWE } from '@panva/jose'
import { issueNewToken } from '../auth/jwt'
import { setAuthCookie } from '../auth/middleware'
import User from '../models/user'
import env from '../utils/env'

const STEAM_ID_COOKIE_NAME = 'steamID'
// generated with: JWK.generateSync('oct')
// TODO: move in key db
const STEAM_ID_COOKIE_KEY = JWK.importKey(fs.readFileSync('STEAM_KEY')) as JWK.OctKey

interface Options {
    app: Application
    baseURL: string
    authPath: string
    tempPath: string
}

const guard: RequestHandler = (req, res, next) => {
    if (req.user || req.cookies[STEAM_ID_COOKIE_NAME]) {
        res.redirect('/')
    } else {
        next()
    }
}

const cb = (steamID: string, res: Response) => {
    User.getUsingSteamID(steamID).then(user => {
        if (user) {
            const token = issueNewToken(user)
            setAuthCookie(res, token)
            res.redirect('/')
        } else {
            res.cookie(STEAM_ID_COOKIE_NAME, JWE.encrypt(steamID, STEAM_ID_COOKIE_KEY), {
                httpOnly: true,
                secure: env.SSL,
                sameSite: true
            })
            res.redirect('/')
        }
    })
}

const getSteamID = (req: Request, res: Response): Promise<string> =>
    new Promise((resolve, reject) => {
        const cookie = req.cookies[STEAM_ID_COOKIE_NAME]
        if (cookie) {
            try {
                const steamID = JWE.decrypt(cookie, STEAM_ID_COOKIE_KEY).toString()
                resolve(steamID)
            } catch {
                reject(new Error('steamID not valid!'))
            } finally {
                res.clearCookie(STEAM_ID_COOKIE_NAME)
            }
        } else {
            reject(new Error('no steamID cookie provided!'))
        }
    })

const initSteamAuth = (opts: Options) => {
    const relyingParty = new RelyingParty(`${opts.baseURL}${opts.tempPath}`, opts.baseURL, true, true, [])

    opts.app.get(opts.authPath, guard, (_, res, next) => {
        relyingParty.authenticate('https://steamcommunity.com/openid', false, (err, authURL) => {
            if (err) {
                console.log(err)
                return next(`Authentication failed: ${err}`)
            }

            if (!authURL) {
                return next('Authentication failed.')
            }

            res.redirect(authURL)
        })
    })

    opts.app.get(opts.tempPath, guard, (req, res, next) => {
        relyingParty.verifyAssertion(req, (err, result) => {
            if (err) {
                return next(err.message)
            }

            if (!result || !result.authenticated) {
                return next('Failed to authenticate user.')
            }

            if (!/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(result.claimedIdentifier)) {
                return next('Claimed identity is not valid.')
            }

            const steamID = result.claimedIdentifier.replace('https://steamcommunity.com/openid/id/', '')

            cb(steamID, res)
        })
    })
}

export { initSteamAuth, getSteamID }
