import { IDirectiveResolvers } from 'graphql-tools'
import { AuthenticationError, AuthorizationError } from './errors'

const directiveResolvers: IDirectiveResolvers = {
    isAuthenticated(next, source, args, context) {
        const user = context.user

        if (!user) {
            throw new AuthenticationError()
        }

        return next()
    },
    hasScope(next, source, args, context) {
        const user = context.user
        const expectedScopes: string[] = args.scope

        if (!user) {
            throw new AuthenticationError()
        }

        const scopes = user.perm.split(' ')
        if (expectedScopes.some(scope => scopes.indexOf(scope) !== -1)) {
            return next()
        } else {
            throw new AuthorizationError()
        }
    }
}

export { directiveResolvers }
