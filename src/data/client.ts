import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'
import isNode from 'detect-node'
import nodeFetch from 'node-fetch'

const headers = { 'content-type': 'application/json' }
const getHeaders = () => headers
const uri = isNode ? `http://localhost:${process.env.PORT}/graphql` : '/graphql'
const cache = new InMemoryCache()

const wsLink = process.browser
    ? new WebSocketLink({
          uri,
          options: {
              reconnect: true,
              lazy: true
          },
          connectionParams: () => ({ headers: getHeaders() })
      })
    : null

const httpLink = new HttpLink({
    uri,
    headers: getHeaders(),
    fetch: nodeFetch
})

const link = process.browser
    ? split(
          ({ query }) => {
              const { kind, operation } = getMainDefinition(query)
              return kind === 'OperationDefinition' && operation === 'subscription'
          },
          wsLink,
          httpLink
      )
    : httpLink

export const client = new ApolloClient({
    link,
    cache
})
