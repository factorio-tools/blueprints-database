import { AuthChecker } from 'type-graphql'

const authChecker: AuthChecker<GQLContext> = ({ context: { user } }, roles) => {
    // `@Authorized()` --> only check if user is logged in
    if (roles.length === 0) {
        return user !== undefined
    }

    // no user --> restrict access
    if (!user) {
        return false
    }

    // TODO: implement roles and permissions
    // if (user.roles.some(role => roles.includes(role))) {
    //     // grant access if the roles overlap
    //     return true
    // }

    // no roles matched --> restrict access
    return false
}

export default authChecker
