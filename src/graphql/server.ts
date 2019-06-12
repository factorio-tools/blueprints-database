import { ApolloServer, PlaygroundConfig } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { Application } from 'express'
import env from '../utils/env'
import { directiveResolvers } from './directives'
import { default as typeDefs } from './schema.gql'
import { formatError } from './errors'
import resolvers from './resolvers'

const initGQLServer = (app: Application) => {
    const schema = makeExecutableSchema({ typeDefs, resolvers, directiveResolvers })

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
}

export { initGQLServer }
