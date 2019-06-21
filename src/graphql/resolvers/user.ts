import { ObjectType, Field, ID, Resolver, Query, Mutation, Ctx, Arg, Args, Authorized } from 'type-graphql'
import { Request, Response } from 'express'
import { default as UserModel } from '../../models/user'
import { setAuthCookie, clearAuthCookie } from '../../auth/middleware'
import { issueNewToken } from '../../auth/jwt'
import { getSteamID, clearSteamIDCookie } from '../../auth/steam'

@ObjectType()
class User {
    @Field(() => ID)
    public id!: string

    // @Field({ nullable: true })
    public steamID?: string

    @Field()
    public username!: string

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

@Resolver(User)
class UserResolver {
    @Query(() => User)
    public me(@Ctx('user') user: User) {
        if (user) {
            return UserModel.get(user.id)
        } else {
            return new Error('log in first')
        }
    }

    @Mutation(() => User)
    public register(
        @Ctx('user') user: User,
        @Ctx('res') res: Response,
        @Arg('username') username: string,
        @Arg('password') password: string,
        @Arg('email', { nullable: true }) email?: string
    ) {
        if (user) {
            return new Error('already logged in')
        } else {
            return UserModel.create(username, password, email).then(user => {
                const token = issueNewToken(user)
                setAuthCookie(res, token)
                return user
            })
        }
    }

    @Mutation(() => User)
    public registerWithSteam(
        @Ctx('user') user: User,
        @Ctx('res') res: Response,
        @Ctx('req') req: Request,
        @Arg('username') username: string,
        @Arg('email', { nullable: true }) email?: string
    ) {
        if (user) {
            return new Error('already logged in')
        } else {
            return getSteamID(req, res).then(steamID =>
                UserModel.createUsingSteamID(steamID, username, email).then(user => {
                    clearSteamIDCookie(res)

                    const token = issueNewToken(user)
                    setAuthCookie(res, token)
                    return user
                })
            )
        }
    }

    @Mutation(() => User)
    public login(
        @Ctx('user') user: User,
        @Ctx('res') res: Response,
        @Arg('username') username: string,
        @Arg('password') password: string
    ) {
        if (user) {
            return new Error('already logged in')
        } else {
            return UserModel.getUsingUsernameAndPassword(username, password).then(user => {
                const token = issueNewToken(user)
                setAuthCookie(res, token)
                return user
            })
        }
    }

    @Mutation(() => Boolean)
    public logout(@Ctx('user') user: User, @Ctx('res') res: Response) {
        if (user) {
            clearAuthCookie(res)
            return true
        }
        return new Error('not logged in')
    }

    // @Query(() => User)
    // public recipe(@Arg('id') id: string) {
    //     const recipe = await UserModel.findById(id)
    //     if (recipe === undefined) {
    //         throw new RecipeNotFoundError(id)
    //     }
    //     return recipe
    // }

    // @Query(() => [User])
    // public recipes(@Args() { skip, take }: RecipesArgs) {
    //     return UserModel.findAll({ skip, take })
    // }

    // @Mutation(() => User)
    // @Authorized()
    // public addRecipe(@Arg('newRecipeData') newRecipeData: NewRecipeInput, @Ctx('user') user: User): Promise<Recipe> {
    //     return UserModel.addNew({ data: newRecipeData, user })
    // }

    // @Mutation(() => Boolean)
    // @Authorized(Roles.Admin)
    // public async removeRecipe(@Arg('id') id: string) {
    //     try {
    //         await UserModel.removeById(id)
    //         return true
    //     } catch {
    //         return false
    //     }
    // }
}

export { UserResolver }
