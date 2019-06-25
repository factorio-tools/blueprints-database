/* eslint-disable import/group-exports */
import { ApolloError } from 'apollo-server-express'
import { GraphQLError, GraphQLFormattedError } from 'graphql'

class AuthenticationError extends ApolloError {
    public readonly name = 'AuthenticationError'
    public constructor(message = 'You are not authenticated!') {
        super(message, 'NOT_AUTHENTICATED')
    }
}

class AuthorizationError extends ApolloError {
    public readonly name = 'AuthorizationError'
    public constructor(message = 'You are not authorized!') {
        super(message, 'NOT_AUTHORIZED')
    }
}

class InternalServerError extends ApolloError {
    public readonly name = 'InternalServerError'
    public constructor(message = 'Something went wrong') {
        super(message, 'INTERNAL_SERVER_ERROR')
    }
}

class ArrayOfErrors extends ApolloError {
    public readonly name = 'ArrayOfErrors'
    public constructor(messages: string[]) {
        super(messages.join('\n'), 'ARRAY_OF_ERRORS')
    }
}

/** Used for error masking and potentially logging */
const formatError = (error: GraphQLError): GraphQLFormattedError => {
    // Don't give the specific errors to the client
    if (error.message.startsWith('Database Error: ')) {
        return new InternalServerError()
    }

    return error
}

export { AuthenticationError, AuthorizationError, InternalServerError, ArrayOfErrors, formatError }
// export { SyntaxError, ValidationError, ForbiddenError, UserInputError } from 'apollo-server-express'
