import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import cookieParser from 'cookie-parser'
import { initGQLServer } from './graphql/server'
import { initSteamAuth } from './auth/steam'
import { attachUserToContext } from './auth/middleware'
import env from './utils/env'
import constants from './utils/constants'
import User from './models/user'
import { initDBClient } from './database/client'

const app = express()

app.use(cookieParser())

app.use(attachUserToContext(User.get))

initSteamAuth({
    app,
    baseURL: env.URL,
    authPath: '/steamauth',
    tempPath: '/steamtemp'
})

initDBClient().then(() => {
    initGQLServer(app).then(() => {
        app.use(
            compression({ threshold: 0 }),
            sirv('static', { dev: env.IS_DEV_ENV }),
            sapper.middleware({
                session: req => ({
                    authToken: req.cookies[constants.AUTH_TOKEN_NAME],
                    user: req.user
                })
            })
        )

        app.listen(env.PORT, () => console.log('Server Started!'))
    })
})
