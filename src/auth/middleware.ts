import { Response, RequestHandler } from 'express'
import env from '../utils/env'
import constants from '../utils/constants'
import util from '../utils/util'
import { issueNewToken, verify } from './jwt'

const getTokenStatus = (
    token: string,
    getUserFromDB: (id: string) => Promise<User | undefined>
): Promise<undefined | { user: UserData; newToken?: string; expSession?: number }> =>
    new Promise(resolve => {
        try {
            const data = verify(token)
            const now = util.currentUnixTime()

            if (now > data.expSession) {
                // session expired
                resolve(undefined)
            }

            if (now > data.exp) {
                // get user from db
                resolve(
                    getUserFromDB(data.sub).then(user => {
                        if (user) {
                            if (data.epoch === user.jwtEpoch) {
                                // token expired
                                return {
                                    user: { id: user.id, role: user.role, perm: user.extraPerm },
                                    newToken: issueNewToken(user, data.expSession),
                                    expSession: data.expSession
                                }
                            } else {
                                // session revoked
                                return undefined
                            }
                        } else {
                            // user not found in db
                            return undefined
                        }
                    })
                )
            }

            // valid token
            resolve({ user: { id: data.sub, role: data.role, perm: data.perm } })
        } catch (err) {
            // invalid token
            resolve(undefined)
        }
    })

const setAuthCookie = (res: Response, token: string, expires = util.currentUnixTime() + constants.SESSION_LENGTH) => {
    res.cookie(constants.AUTH_TOKEN_NAME, token, {
        domain: env.MAIN_DOMAIN,
        httpOnly: true,
        secure: env.SSL,
        expires: new Date(expires * 1000),
        sameSite: 'lax'
    })
}

const clearAuthCookie = (res: Response) => {
    res.clearCookie(constants.AUTH_TOKEN_NAME)
}

const attachUserToContext = (getUserFromDB: (id: string) => Promise<User | undefined>): RequestHandler => (
    req,
    res,
    next
) => {
    const token =
        req.cookies[constants.AUTH_TOKEN_NAME] ||
        (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : undefined)

    if (token) {
        getTokenStatus(token, getUserFromDB).then(result => {
            if (result) {
                req.user = result.user

                if (result.newToken && result.expSession) {
                    setAuthCookie(res, result.newToken, result.expSession)
                }
            } else {
                clearAuthCookie(res)
            }
            next()
        })
    } else {
        next()
    }
}

export { attachUserToContext, setAuthCookie, clearAuthCookie }