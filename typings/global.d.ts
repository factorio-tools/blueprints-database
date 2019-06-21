declare namespace NodeJS {
    interface Process {
        browser: boolean
    }
}

declare module '*.gql' {
    import { DocumentNode } from 'graphql'
    const content: DocumentNode
    export default content
    // TODO: find a way to specify that all the named exports are of type DocumentNode
}

declare module '*.graphqls' {
    const content: string
    export default content
}

interface Cookies {
    [key: string]: string
}

declare namespace Express {
    export interface Request extends Express.Request {
        user: UserData
        cookies: Cookies
    }
}
