import { ApolloServer, PlaygroundConfig } from 'apollo-server-express'
import { Application, Request, Response } from 'express'
import { buildSchema } from 'type-graphql'
import env from '~/utils/env'
import { Validator } from 'class-validator/validation/Validator'
import { getFromContainer } from 'class-validator/container'
import { formatError } from './errors'
import resolvers from './resolvers'
import authChecker from './authCheker'

const validator = getFromContainer(Validator)

const initGQLServer = (app: Application) =>
    buildSchema({
        resolvers,
        authChecker,
        validate: true,
        validateOrRejectFn: validator.validateOrReject.bind(validator)
        // authMode: 'null'
    }).then(schema => {
        // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
        const playgroundOpts = {
            settings: {
                'request.credentials': 'include'
            }
        } as PlaygroundConfig

        const context = ({ req, res }: { req: Request; res: Response }): GQLContext => ({
            user: req.user,
            req,
            res
        })

        const server = new ApolloServer({
            schema,
            formatError,
            context,
            playground: env.IS_DEV_ENV ? playgroundOpts : false
        })

        server.applyMiddleware({ app, path: '/graphql' })

        return {
            schema,
            context
        }
    })

export { initGQLServer }
