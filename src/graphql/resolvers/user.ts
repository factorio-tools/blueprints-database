import {
    ObjectType,
    Field,
    ID,
    Resolver,
    Query,
    Mutation,
    Ctx,
    Arg,
    Authorized,
    createMethodDecorator
} from 'type-graphql'
import { ArrayOfErrors } from '../errors'
import { RegisterInput, RegisterWithSteamInput, LoginInput } from './userInputTypes'
import UserModel from '~/models/user'
import { setAuthCookie, clearAuthCookie } from '~/auth/middleware'
import { issueNewToken } from '~/auth/jwt'
import { getSteamID, clearSteamIDCookie } from '~/auth/steam'

@ObjectType()
class User {
    @Field(() => ID)
    public id!: string

    // @Field({ nullable: true })
    public steamID?: string

    @Field()
    public username!: string

    @Field()
    public displayname!: string

    // @Field({ nullable: true })
    public password?: string

    @Field({ nullable: true })
    public email?: string

    @Field()
    public role!: string

    @Field(() => [String])
    public extraPerm!: string[]

    // @Field()
    public jwtEpoch!: string
}

function BlockIfLoggedIn() {
    return createMethodDecorator<GQLContext>(({ context: { user } }, next) => {
        if (user) {
            throw new Error('Already logged in!')
        } else {
            return next()
        }
    })
}

function BlockIfProvidedUserDataIsInUse() {
    return createMethodDecorator<GQLContext>(({ args: { input } }, next) => {
        const checkData = [
            {
                var: input.username,
                fn: UserModel.getUsingUsername,
                error: 'Username taken!'
            },
            {
                var: input.steamID,
                fn: UserModel.getUsingSteamID,
                error: 'Steam account already registered!'
            },
            {
                var: input.email,
                fn: UserModel.getUsingEmail,
                error: 'Email address taken!'
            }
        ]

        return Promise.all(checkData.map(opts => (opts.var ? opts.fn(opts.var) : undefined))).then(
            users => {
                const errors = users
                    .map((user, i) => (user ? checkData[i].error : undefined))
                    .filter(Boolean) as string[]

                if (errors.length === 0) {
                    return next()
                } else {
                    throw new ArrayOfErrors(errors)
                }
            }
        )
    })
}

@Resolver(User)
class UserResolver {
    @Query(() => User)
    @Authorized()
    public me(@Ctx() ctx: GQLContext) {
        return UserModel.get(ctx.user.id)
    }

    @Mutation(() => User)
    @BlockIfLoggedIn()
    @BlockIfProvidedUserDataIsInUse()
    public register(@Ctx() ctx: GQLContext, @Arg('input') input: RegisterInput) {
        return UserModel.create(input.username, input.password, input.email).then(user => {
            const token = issueNewToken(user)
            setAuthCookie(ctx.res, token)
            return user
        })
    }

    @Mutation(() => User)
    @BlockIfLoggedIn()
    @BlockIfProvidedUserDataIsInUse()
    public registerWithSteam(@Ctx() ctx: GQLContext, @Arg('input') input: RegisterWithSteamInput) {
        return getSteamID(ctx.req, ctx.res).then(steamID =>
            UserModel.createUsingSteamID(steamID, input.username, input.email).then(user => {
                clearSteamIDCookie(ctx.res)

                const token = issueNewToken(user)
                setAuthCookie(ctx.res, token)
                return user
            })
        )
    }

    @Mutation(() => User)
    @BlockIfLoggedIn()
    public login(@Ctx() ctx: GQLContext, @Arg('input') input: LoginInput) {
        return UserModel.getUsingUsernameAndPassword(input.username, input.password).then(user => {
            const token = issueNewToken(user)
            setAuthCookie(ctx.res, token)
            return user
        })
    }

    @Mutation(() => Boolean)
    @Authorized()
    public logout(@Ctx() ctx: GQLContext) {
        clearAuthCookie(ctx.res)
        return true
    }
}

export { User, UserResolver }
