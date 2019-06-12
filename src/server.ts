import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import cookieParser from 'cookie-parser'
import { initGQLServer } from './graphql/server'
import { initSteamAuth } from './auth/steam'
import { attachUserToContext, setAuthCookie } from './auth/middleware'
import env from './utils/env'
import constants from './utils/constants'
import { issueNewToken } from './auth/jwt'
import User from './models/user'
// import orango from 'orango'

// orango
//     .get(env.DB_DATABASE)
//     .connect({
//         url: env.DB_URL,
//         username: env.DB_USERNAME,
//         password: env.DB_PASSWORD
//     })
//     .then(c => c.db.listCollections().then(c => console.log(c)))

const app = express()

app.use(cookieParser())

// look for steamID in db
// found -> issueToken
// not found -> create user (ask user for more data too) - ability to cancel

initSteamAuth({
    app,
    baseURL: env.URL,
    authPath: '/steamauth',
    tempPath: '/steamtemp',
    cb: (steamID, res) => {
        User.getUsingSteamID(steamID)
            .then(user => (user ? user : User.createUsingSteamID(steamID)))
            .then(user => {
                const token = issueNewToken(user)
                setAuthCookie(res, token)
                res.redirect('/')
            })
    }
})

app.use(attachUserToContext(User.get))

initGQLServer(app)

app.use(
    compression({ threshold: 0 }),
    sirv('static', { dev: env.IS_DEV_ENV }),
    sapper.middleware({
        session: req => ({
            authToken: req.cookies[constants.AUTH_TOKEN_NAME]
        })
    })
)

app.listen(env.PORT)
