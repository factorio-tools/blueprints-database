import 'reflect-metadata'
import sirv from 'sirv'
import { default as express, Request, Response } from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import cookieParser from 'cookie-parser'
import { initGQLServer } from './graphql/server'
import { initSteamAuth } from './auth/steam'
import { attachUserToContext } from './auth/middleware'
import env from './utils/env'
import UserModel from './models/user'
import { initDBClient } from './database/client'

const app = express()

app.use(cookieParser())

app.use(attachUserToContext(UserModel.get))

initSteamAuth({
    app,
    baseURL: env.URL,
    authPath: '/steamauth',
    tempPath: '/steamtemp'
})

initDBClient().then(() => {
    initGQLServer(app)
        .then(ssrGQLClientData => {
            app.use(
                compression({ threshold: 0 }),
                sirv('static', { dev: env.IS_DEV_ENV }),
                sapper.middleware({
                    session: (req, res) => ({
                        user: req.user,
                        devEnv: env.IS_DEV_ENV,
                        ssrGQLClientData: {
                            schema: ssrGQLClientData.schema,
                            context: ssrGQLClientData.context({ req: req as Request, res: res as Response })
                        }
                    })
                })
            )

            app.listen(env.PORT, () => console.log('Server Started!'))
        })
        .catch(e => console.log(e))
})
