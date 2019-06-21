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

const DB_URL = process.env.DB_URL as string
const DB_USERNAME = process.env.DB_USERNAME as string
const DB_PASSWORD = process.env.DB_PASSWORD as string
const DB_DATABASE = process.env.DB_DATABASE as string

const AUTH_TOKEN_NAME = 'auth_token'
const SESSION_LENGTH = 60 * 60 * 24 * 7 * 4 // 1 month
const TOKEN_LIFESPAN = 60 * 5 // 5 min

const STEAM_ID_COOKIE_NAME = 'steamID'

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
    DB_DATABASE,
    AUTH_TOKEN_NAME,
    SESSION_LENGTH,
    TOKEN_LIFESPAN,
    STEAM_ID_COOKIE_NAME
}
