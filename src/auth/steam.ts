import { RelyingParty } from 'openid'
import { Application, Response, RequestHandler, Request } from 'express'
import { JWE } from '@panva/jose'
import { issueNewToken } from '~/auth/jwt'
import { setAuthCookie } from '~/auth/middleware'
import UserModel from '~/models/user'
import env from '~/utils/env'

interface Options {
    app: Application
    baseURL: string
    authPath: string
    tempPath: string
}

const guard: RequestHandler = (req, res, next) => {
    if (req.user) res.redirect('/')
    else if (req.cookies[env.STEAM_ID_COOKIE_NAME]) res.redirect('/user/steam')
    else next()
}

const cb = (steamID: string, res: Response, redirect: string = '/') => {
    UserModel.getUsingSteamID(steamID).then(user => {
        if (user) {
            const token = issueNewToken(user)
            setAuthCookie(res, token)
            res.redirect(redirect)
        } else {
            res.cookie(env.STEAM_ID_COOKIE_NAME, JWE.encrypt(steamID, env.STEAMID_COOKIE_KEY), {
                httpOnly: true,
                secure: env.SSL,
                sameSite: true
            })
            res.redirect(`/user/steam?redirect=${redirect}`)
        }
    })
}

const clearSteamIDCookie = (res: Response) => {
    res.clearCookie(env.STEAM_ID_COOKIE_NAME)
}

const getSteamID = (req: Request, res: Response): Promise<string> =>
    new Promise((resolve, reject) => {
        const cookie = req.cookies[env.STEAM_ID_COOKIE_NAME]
        if (cookie) {
            try {
                const steamID = JWE.decrypt(cookie, env.STEAMID_COOKIE_KEY).toString()
                resolve(steamID)
            } catch {
                clearSteamIDCookie(res)
                reject(new Error('steamID not valid!'))
            }
        } else {
            reject(new Error('no steamID cookie provided!'))
        }
    })

const initSteamAuth = (opts: Options) => {
    opts.app.get(opts.authPath, guard, (req, res, next) => {
        const redirect: string | undefined = req.query.redirect
        const relyingParty = new RelyingParty(
            `${opts.baseURL}${opts.tempPath}${redirect ? `?redirect=${redirect}` : ''}`,
            opts.baseURL,
            true,
            true,
            []
        )
        relyingParty.authenticate('https://steamcommunity.com/openid', false, (err, authURL) => {
            if (err) return next(`Authentication failed: ${err}`)

            if (!authURL) {
                return next('Authentication failed.')
            }

            res.redirect(authURL)
        })
    })

    opts.app.get(opts.tempPath, guard, (req, res, next) => {
        const redirect: string | undefined = req.query.redirect

        const relyingParty = new RelyingParty(`${opts.baseURL}${opts.tempPath}`, opts.baseURL, true, true, [])
        relyingParty.verifyAssertion(req, (err, result) => {
            if (err) return next(err.message)

            if (!result || !result.authenticated) return next('Failed to authenticate user.')

            if (!/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(result.claimedIdentifier)) {
                return next('Claimed identity is not valid.')
            }

            const steamID = result.claimedIdentifier.replace('https://steamcommunity.com/openid/id/', '')

            cb(steamID, res, redirect)
        })
    })
}

export { initSteamAuth, getSteamID, clearSteamIDCookie }
