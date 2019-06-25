import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { GraphQLSchema } from 'graphql'

let client: ApolloClient<unknown>

if (process.browser) {
    client = new ApolloClient({
        cache: new InMemoryCache(),
        link: createHttpLink({ uri: '/graphql', credentials: 'same-origin' }),
        defaultOptions: {
            query: {
                errorPolicy: 'all'
            },
            mutate: {
                errorPolicy: 'all'
            },
            watchQuery: {
                errorPolicy: 'all'
            }
        }
    })
}

const initSSRGQLClient = async (ssrGQLClientData: { schema: GraphQLSchema; context: GQLContext }) => {
    if (!process.browser) {
        const { SchemaLink } = await import('apollo-link-schema')

        client = new ApolloClient({
            ssrMode: true,
            cache: new InMemoryCache(),
            link: new SchemaLink(ssrGQLClientData),
            defaultOptions: {
                query: {
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'all'
                },
                mutate: {
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'all'
                },
                watchQuery: {
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'all'
                }
            }
        })
    }
}

export { initSSRGQLClient, client }
