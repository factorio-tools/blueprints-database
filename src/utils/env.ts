const NODE_ENV = process.env.NODE_ENV as 'development' | 'production'
const IS_DEV_ENV = NODE_ENV === 'development'

if (IS_DEV_ENV) {
    require('dotenv').config()
}

const PORT = process.env.PORT

const DOMAIN = process.env.DOMAIN || 'localhost'
const MAIN_DOMAIN = process.env.MAIN_DOMAIN || DOMAIN
const SSL = process.env.SSL === 'true'
const URL = `${SSL ? 'https://' : 'http://'}${DOMAIN}${IS_DEV_ENV ? `:${PORT}` : ''}`

const DB_URL = process.env.DB_URL
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE

export default {
    NODE_ENV,
    IS_DEV_ENV,
    PORT,
    DOMAIN,
    MAIN_DOMAIN,
    SSL,
    URL,
    DB_URL,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE
}
