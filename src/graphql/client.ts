import ApolloClient from 'apollo-boost'

let client: ApolloClient<unknown>

if (process.browser) {
    client = new ApolloClient()
}

const initSSRGQLClient = (authToken?: string) => {
    if (!process.browser) {
        client = new ApolloClient({
            // node-fetch needs an absolute URI
            uri: `http://localhost:${process.env.PORT}/graphql`,
            // needed for SSR
            fetch: require('node-fetch'),
            // pass authToken trough sapper for SSR
            headers: {
                authorization: authToken ? `Bearer ${authToken}` : null
            }
        })
    }
}

export { initSSRGQLClient, client }
