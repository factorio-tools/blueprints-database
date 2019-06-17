import fs from 'fs'
import { JWT, JWK } from '@panva/jose'
import constants from '../utils/constants'
import util from '../utils/util'

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
}

// TODO: move key in db
const key = JWK.importKey(fs.readFileSync('JWT_KEY')) as JWK.RSAKey
// Generate with:
// JWK.generateSync('RSA').toPEM(true)

const issueNewToken = (user: User, expSession?: number) => {
    const now = util.currentUnixTime()
    return JWT.sign(
        {
            role: user.role,
            perm: user.extraPerm,
            username: user.username,
            epoch: user.jwtEpoch,
            expSession: expSession ? expSession : now + constants.SESSION_LENGTH,
            exp: now + constants.TOKEN_LIFESPAN
        },
        key,
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

const verify = (token: string) =>
    JWT.verify(token, key, {
        audience: 'https://blueprints.factorio.tools',
        ignoreExp: true
    }) as JWTPayload

export { issueNewToken, verify }
