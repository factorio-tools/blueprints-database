import { JWT } from '@panva/jose'
import env from '~/utils/env'
import util from '~/utils/util'
import { User } from '~/graphql/resolvers/user'

interface JWTPayload {
    role: string
    perm: string[]
    epoch: string
    expSession: number
    sub: string
    aud: string[]
    iss: string
    iat: number
    exp: number
    username: string
    displayname: string
}

const issueNewToken = (user: User, expSession?: number) => {
    const now = util.currentUnixTime()
    return JWT.sign(
        {
            role: user.role,
            perm: user.extraPerm,
            username: user.username,
            displayname: user.displayname,
            epoch: user.jwtEpoch,
            expSession: expSession ? expSession : now + env.SESSION_LENGTH,
            exp: now + env.TOKEN_LIFESPAN
        },
        env.AUTH_TOKEN_KEY,
        {
            subject: user.id,
            audience: ['https://blueprints.factorio.tools'],
            issuer: 'https://blueprints.factorio.tools',
            header: {
                typ: 'JWT'
            }
        }
    )
}

const verifyToken = (token: string): Promise<JWTPayload> =>
    new Promise((resolve, reject) => {
        if (token) {
            try {
                const data = JWT.verify(token, env.AUTH_TOKEN_KEY, {
                    audience: 'https://blueprints.factorio.tools',
                    ignoreExp: true
                }) as JWTPayload
                resolve(data)
            } catch {
                reject('invalid token')
            }
        } else {
            reject('no token provided')
        }
    })

export { issueNewToken, verifyToken }
