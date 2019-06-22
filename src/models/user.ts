import bcrypt from 'bcrypt'
import { JWK } from '@panva/jose'
import { dbClient } from '~/database/client'
import {
    GET_USER_WITH_ID,
    GET_USER_WITH_USERNAME,
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

    create: (username: string, password: string, email?: string): Promise<User> =>
        new Promise((resolve, reject) => {
            User.getUsingUsername(username).then(existingUser => {
                if (existingUser) {
                    reject(new Error('Username taken!'))
                } else if (username.length > 25 || password.length > 50) {
                    reject(new Error('Username or password have too many characters.'))
                } else {
                    Promise.all([bcrypt.hash(password, saltRounds), JWK.generate('oct')]).then(([pass, jwtEpoch]) =>
                        // create new user
                        dbClient
                            .mutate(CREATE_USER_WITH_PASSWORD, {
                                username: username.toLowerCase(),
                                displayname: username,
                                password: pass,
                                email,
                                jwtEpoch: jwtEpoch.k
                            })
                            .then(res => {
                                resolve(res.data.createUser as User)
                            })
                    )
                }
            })
        }),

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

    createUsingSteamID: (steamID: string, username: string, email?: string): Promise<User> =>
        new Promise((resolve, reject) => {
            User.getUsingSteamID(steamID).then(existingUser => {
                if (existingUser) {
                    reject(new Error('account already exists!'))
                } else if (username.length > 25) {
                    reject(new Error('Username cannot have more than 25 characters.'))
                } else {
                    User.getUsingUsername(username).then(existingUser => {
                        if (existingUser) {
                            reject(new Error('username taken!'))
                        } else {
                            // create new user
                            dbClient
                                .mutate(CREATE_USER_WITH_STEAMID, {
                                    username: username.toLowerCase(),
                                    displayname: username,
                                    steamID,
                                    email,
                                    jwtEpoch: JWK.generateSync('oct').k
                                })
                                .then(res => {
                                    resolve(res.data.createUser as User)
                                })
                        }
                    })
                }
            })
        })
}

export default User
