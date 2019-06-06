import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
// import orango from 'orango'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './graphql'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

if (dev) {
    require('dotenv').config()
}

// orango
//     .get(process.env.DB_DATABASE)
//     .connect({
//         url: process.env.DB_URL,
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD
//     })
//     .then(c => c.db.listCollections().then(c => console.log(c)))

const app = express()

const server = new ApolloServer({
    typeDefs,
    resolvers
})
server.applyMiddleware({ app, path: '/graphql' })

app.use(compression({ threshold: 0 }), sirv('static', { dev }), sapper.middleware())

app.listen(PORT)
