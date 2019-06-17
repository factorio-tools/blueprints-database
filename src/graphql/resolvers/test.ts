import {
    ObjectType,
    Field,
    ID,
    Resolver,
    Query,
    Mutation,
    Ctx,
    Arg,
    Args,
    Authorized,
    FieldResolver,
    Root,
    ResolverInterface
} from 'type-graphql'

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

@ObjectType()
class Author {
    @Field(() => ID)
    public id!: number

    @Field()
    public firstName!: string

    @Field()
    public lastName!: string
}

@ObjectType()
class Post {
    @Field(() => ID)
    public id!: number

    @Field()
    public title!: string

    public authorId!: number

    @Field(() => Author)
    public author!: Author

    @Field()
    public votes!: number
}

@ObjectType()
class Favorite {
    @Field(() => ID)
    public id!: number

    @Field()
    public title!: string
}

@Resolver(Post)
class PostResolver implements ResolverInterface<Post> {
    @Query(() => [Post])
    public posts() {
        return posts
    }

    @FieldResolver()
    public author(@Root() post: Post) {
        return authors.find(a => post.authorId === a.id) as Author
    }
}

@Resolver(Favorite)
class FavoriteResolver {
    @Query(() => [Favorite])
    public favorites() {
        return favorites
    }
}

export default [PostResolver, FavoriteResolver]
