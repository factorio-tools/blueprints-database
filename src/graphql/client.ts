import ApolloClient from 'apollo-boost'

// Needed so that SSR works with ApolloClient
const fetch = process.browser ? window.fetch : require('node-fetch')
// Needed because node-fetch needs an absolute URI
const uri = process.browser ? '/graphql' : `http://localhost:${process.env.PORT}/graphql`

const client = new ApolloClient({ uri, fetch })

export { client }
