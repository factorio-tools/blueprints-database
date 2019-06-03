import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

if (dev) {
    require('dotenv').config()
}

express()
    .use(compression({ threshold: 0 }), sirv('static', { dev }), sapper.middleware())
    .listen(PORT)
