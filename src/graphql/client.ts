import ApolloClient from 'apollo-boost'

let client

const initGQLClient = (authToken?: string) => {
    if (process.browser) {
        client = new ApolloClient()
    } else {
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

export { initGQLClient, client }
