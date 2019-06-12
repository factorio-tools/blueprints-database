import { RelyingParty } from 'openid'
import { Application, Response } from 'express'

interface Options {
    app: Application
    baseURL: string
    authPath: string
    tempPath: string
    cb: (steamID: string, res: Response) => void
}

const initSteamAuth = (opts: Options) => {
    const relyingParty = new RelyingParty(`${opts.baseURL}${opts.tempPath}`, opts.baseURL, true, true, [])

    opts.app.get(opts.authPath, (_, res, next) => {
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

    opts.app.get(opts.tempPath, (req, res, next) => {
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

            opts.cb(steamID, res)
        })
    })
}

export { initSteamAuth }
