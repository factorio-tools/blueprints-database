import bcrypt from 'bcrypt'
import { JWK } from '@panva/jose'
import { dbClient } from '~/database/client'
import { User } from '~/graphql/resolvers/user'
import {
    GET_USER_WITH_ID,
    GET_USER_WITH_USERNAME,
    GET_USER_WITH_EMAIL,
    GET_USER_WITH_STEAMID,
    CREATE_USER_WITH_PASSWORD,
    CREATE_USER_WITH_STEAMID
} from '~/database/queries.gql'
import { InternalServerError } from '~/graphql/errors'

const saltRounds = 10

const UserModel = {
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
        UserModel.getUsingUsername(username).then(async user => {
            if (user && user.password) {
                const matches = await bcrypt.compare(password, user.password)
                if (matches) return user
            }
            throw new Error('Invalid credentials!')
        }),

    getUsingSteamID: (steamID: string): Promise<User | undefined> =>
        dbClient
            .query(GET_USER_WITH_STEAMID, {
                steamID
            })
            .then(res => res.data.allUsers[0]),

    create: (username: string, password: string, email?: string): Promise<User> =>
        Promise.all([bcrypt.hash(password, saltRounds), JWK.generate('oct')])
            .then(([pass, jwtEpoch]) =>
                // create new user
                dbClient.mutate(CREATE_USER_WITH_PASSWORD, {
                    username: username.toLowerCase(),
                    displayname: username,
                    password: pass,
                    email: (email && email.toLowerCase()) || undefined,
                    jwtEpoch: jwtEpoch.k
                })
            )
            .then(res => res.data.createUser as User)
            .catch(err => {
                console.log(err)
                throw new InternalServerError()
            }),

    createUsingSteamID: (steamID: string, username: string, email?: string): Promise<User> =>
        // create new user
        dbClient
            .mutate(CREATE_USER_WITH_STEAMID, {
                username: username.toLowerCase(),
                displayname: username,
                steamID,
                email: (email && email.toLowerCase()) || undefined,
                jwtEpoch: JWK.generateSync('oct').k
            })
            .then(res => res.data.createUser as User)
            .catch(err => {
                console.log(err)
                throw new InternalServerError()
            })
}

export default UserModel
