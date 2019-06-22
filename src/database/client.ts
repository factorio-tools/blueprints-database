import { Project, ArangoDBAdapter, Logger, LoggerProvider } from 'cruddl'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { getLogger } from 'log4js'
import { DocumentNode } from 'graphql'
import env from '~/utils/env'
import dbSchema from './schema.graphqls'

class Log4jsLoggerProvider implements LoggerProvider {
    public readonly level: string
    public readonly levelByCategory: Record<string, string>

    public constructor(level: string, levelByCategory: Record<string, string> = {}) {
        this.level = level
        this.levelByCategory = levelByCategory
    }

    public getLogger(category: string): Logger {
        const logger = getLogger(category)
        logger.level = this.levelByCategory[category] || this.level
        return logger
    }
}

let dbClient: ReturnType<typeof getCustomClient>

// https://github.com/AEB-labs/cruddl/issues/82
const getCustomClient = (gqlClient: ApolloClient<unknown>) => ({
    query: (query: DocumentNode, variables?: Record<string, unknown>) =>
        gqlClient.query({ query: { ...query }, variables }),

    mutate: (mutation: DocumentNode, variables?: Record<string, unknown>) =>
        gqlClient.mutate({ mutation: { ...mutation }, variables })
})

const initDBClient = () => {
    const loggerProvider = new Log4jsLoggerProvider('error')

    const db = new ArangoDBAdapter(
        {
            databaseName: env.DB_DATABASE,
            url: env.DB_URL,
            user: env.DB_USERNAME,
            password: env.DB_PASSWORD
        },
        { loggerProvider }
    )

    const project = new Project({
        sources: [
            {
                name: 'schema.graphqls',
                body: dbSchema
            },
            {
                name: 'permission-profiles.json',
                body: JSON.stringify({
                    permissionProfiles: {
                        default: {
                            permissions: [
                                {
                                    roles: ['any'],
                                    access: 'readWrite'
                                }
                            ]
                        }
                    }
                })
            }
        ],
        getExecutionOptions: () => ({ authRoles: ['any'] }),
        loggerProvider
    })

    // create missing collections then return client
    return db.updateSchema(project.getModel()).then(() => {
        const c = new ApolloClient({
            cache: new InMemoryCache(),
            link: new SchemaLink({ schema: project.createSchema(db) }),
            defaultOptions: {
                query: {
                    fetchPolicy: 'no-cache'
                }
            }
        })

        dbClient = getCustomClient(c)

        return dbClient
    })
}

export { initDBClient, dbClient }
