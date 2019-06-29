import { Response, RequestHandler } from 'express'
import { issueNewToken, verifyToken } from './jwt'
import env from '~/utils/env'
import util from '~/utils/util'
import { User } from '~/graphql/resolvers/user'

const setAuthCookie = (res: Response, token: string, expires = util.currentUnixTime() + env.SESSION_LENGTH) => {
    res.cookie(env.AUTH_TOKEN_NAME, token, {
        domain: env.MAIN_DOMAIN,
        httpOnly: true,
        secure: env.SSL,
        expires: new Date(expires * 1000),
        sameSite: 'lax',
        path: '/'
    })
}

const clearAuthCookie = (res: Response) => {
    res.clearCookie(env.AUTH_TOKEN_NAME, {
        domain: env.MAIN_DOMAIN,
        path: '/'
    })
}

const attachUserToContext = (getUserFromDB: (id: string) => Promise<User | undefined>): RequestHandler => (
    req,
    res,
    next
) => {
    const token =
        req.cookies[env.AUTH_TOKEN_NAME] ||
        (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : undefined)

    verifyToken(token)
        .then(data => {
            const now = util.currentUnixTime()

            if (now > data.expSession) {
                throw new Error('session expired')
            }

            if (now > data.exp) {
                return getUserFromDB(data.sub).then(user => {
                    if (!user) throw new Error('user not found in db')
                    if (data.epoch !== user.jwtEpoch) throw new Error('session revoked')

                    // token expired, renew
                    const newToken = issueNewToken(user, data.expSession)
                    setAuthCookie(res, newToken, data.expSession)

                    return {
                        id: user.id,
                        role: user.role,
                        extraPerm: user.extraPerm,
                        username: user.username,
                        displayname: user.displayname
                    }
                })
            }

            return {
                id: data.sub,
                role: data.role,
                extraPerm: data.perm,
                username: data.username,
                displayname: data.displayname
            }
        })
        .then(user => {
            req.user = user
        })
        .catch(() => {
            if (token) clearAuthCookie(res)
        })
        .finally(() => {
            next()
        })
}

export { attachUserToContext, setAuthCookie, clearAuthCookie }
