import { IResolvers } from 'apollo-server-express'
import { Response } from 'express'
import { EmailAddress } from '@okgrow/graphql-scalars'
import { setAuthCookie, clearAuthCookie } from '../auth/middleware'
import { issueNewToken } from '../auth/jwt'
import User from '../models/user'

interface GQLContext {
    user: User
    res: Response
}

// example data
const authors = [
    { id: 1, firstName: 'Tom', lastName: 'Coleman' },
    { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
    { id: 3, firstName: 'Mikhail', lastName: 'Novikov' }
]
const posts = [
    { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
    { id: 2, authorId: 2, title: 'Welcome to Meteor', votes: 3 },
    { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
    { id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7 }
]

const favorites = [{ id: 1, title: 'Favorite 1' }, { id: 2, title: 'Favorite 2' }]

const resolvers: IResolvers<any, GQLContext> = {
    EmailAddress,

    Query: {
        posts: () => posts,
        favorites: () => favorites,
        author: (_, { id }) => authors.find(a => a.id === id)
    },

    Mutation: {
        upvotePost: (_, { postId }) => {
            const post = posts.find(p => p.id === postId)
            if (!post) {
                throw new Error(`Couldn't find post with id ${postId}`)
            }
            post.votes += 1
            return post
        },
        register: (obj, { username, password, email }, context) => {
            if (context.user) {
                return new Error('already logged in')
            } else {
                return User.create(username, password, email).then(user => {
                    const token = issueNewToken(user)
                    setAuthCookie(context.res, token)
                    return user
                })
            }
        },
        login: (obj, { username, password }, context) => {
            if (context.user) {
                return new Error('already logged in')
            } else {
                return User.getUsingUsernameAndPassword(username, password).then(user => {
                    const token = issueNewToken(user)
                    setAuthCookie(context.res, token)
                    return user
                })
            }
        },
        logout: (obj, args, context) => {
            if (context.user) {
                clearAuthCookie(context.res)
                return true
            }
            return new Error('not logged in')
        }
    },

    Author: {
        posts: author => posts.filter(p => p.authorId === author.id)
    },

    Post: {
        author: post => authors.find(a => a.id === post.authorId)
    }
}

export default resolvers
