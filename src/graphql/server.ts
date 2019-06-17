import 'reflect-metadata'
import { ApolloServer, PlaygroundConfig } from 'apollo-server-express'
import { Application } from 'express'
import { buildSchema } from 'type-graphql'
import env from '../utils/env'
import { formatError } from './errors'
import resolvers from './resolvers'
import authChecker from './authCheker'

const initGQLServer = (app: Application) =>
    buildSchema({
        resolvers,
        authChecker
        // authMode: 'null'
    })
        .then(schema => {
            // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
            const playgroundOpts = {
                settings: {
                    'request.credentials': 'include'
                }
            } as PlaygroundConfig

            const server = new ApolloServer({
                schema,
                formatError,
                context: ({ req, res }) => ({
                    user: req.user,
                    req,
                    res
                }),
                playground: env.IS_DEV_ENV ? playgroundOpts : false
            })

            server.applyMiddleware({ app, path: '/graphql' })
        })
        .catch(e => console.log(e))

export { initGQLServer }
