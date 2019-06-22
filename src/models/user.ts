import bcrypt from 'bcrypt'
import { JWK } from '@panva/jose'
import { dbClient } from '~/database/client'
import {
    GET_USER_WITH_ID,
    GET_USER_WITH_USERNAME,
    GET_USER_WITH_EMAIL,
    GET_USER_WITH_STEAMID,
    CREATE_USER_WITH_PASSWORD,
    CREATE_USER_WITH_STEAMID
} from '~/database/queries.gql'

const saltRounds = 10

const User = {
    get: (id: string): Promise<User | undefined> =>
        dbClient
            .query(GET_USER_WITH_ID, {
                id
            })
            .then(res => res.data.User),

    getUsingUsername: (username: string): Promise<User | undefined> =>
        dbClient
            .query(GET_USER_WITH_USERNAME, {
                username: username.toLowerCase()
            })
            .then(res => res.data.allUsers[0]),

    getUsingEmail: (email: string): Promise<User | undefined> =>
        dbClient
            .query(GET_USER_WITH_EMAIL, {
                email: email.toLowerCase()
            })
            .then(res => res.data.allUsers[0]),

    getUsingUsernameAndPassword: (username: string, password: string): Promise<User> =>
        new Promise((resolve, reject) => {
            User.getUsingUsername(username).then(user => {
                if (user && user.password) {
                    bcrypt.compare(password, user.password).then(same => {
                        if (same) {
                            resolve(user)
                        } else {
                            reject(new Error('Invalid credentials!'))
                        }
                    })
                } else {
                    reject(new Error('invalid credentials!'))
                }
            })
        }),

    getUsingSteamID: (steamID: string): Promise<User | undefined> =>
        dbClient
            .query(GET_USER_WITH_STEAMID, {
                steamID
            })
            .then(res => res.data.allUsers[0]),

    create: (username: string, password: string, email?: string): Promise<User> =>
        new Promise(async (resolve, reject) => {
            const error = await validateUserFields(username, undefined, password, email || undefined)
            if (error !== false) return reject(error)

            Promise.all([bcrypt.hash(password, saltRounds), JWK.generate('oct')]).then(([pass, jwtEpoch]) =>
                // create new user
                dbClient
                    .mutate(CREATE_USER_WITH_PASSWORD, {
                        username: username.toLowerCase(),
                        displayname: username,
                        password: pass,
                        email: (email && email.toLowerCase()) || undefined,
                        jwtEpoch: jwtEpoch.k
                    })
                    .then(res => {
                        resolve(res.data.createUser as User)
                    })
                    .catch(err => {
                        console.log(err)
                        reject('Something went wrong.')
                    })
            )
        }),

    createUsingSteamID: (steamID: string, username: string, email?: string): Promise<User> =>
        new Promise(async (resolve, reject) => {
            const error = await validateUserFields(username, steamID, undefined, email || undefined)
            if (error !== false) return reject(error)

            // create new user
            dbClient
                .mutate(CREATE_USER_WITH_STEAMID, {
                    username: username.toLowerCase(),
                    displayname: username,
                    steamID,
                    email: (email && email.toLowerCase()) || undefined,
                    jwtEpoch: JWK.generateSync('oct').k
                })
                .then(res => {
                    resolve(res.data.createUser as User)
                })
                .catch(err => {
                    console.log(err)
                    reject('Something went wrong.')
                })
        })
}

const validateUserFields = async (username: string, steamID?: string, password?: string, email?: string) => {
    const existingUser = await User.getUsingUsername(username)
    const existingUserSteam = steamID ? await User.getUsingSteamID(steamID) : undefined
    const existingUserEmail = email ? await User.getUsingEmail(email) : undefined

    if (existingUser) return new Error('Username taken!')
    if (existingUserSteam) return new Error('Steam account already registered')
    if (existingUserEmail) return new Error('Email address taken!')
    if (username.length > 25) return new Error('Username cannot be longer than 25 characters.')
    if (password && password.length > 50) return new Error('Password cannot be longer than 50 characters.')
    if (email && email.length > 75) return new Error('Email address is too long')

    return false
}

export default User
