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

interface UserData {
    id: string
    role: string
    perm: string
}

interface Cookies {
    [key: string]: string
}

declare namespace Express {
    export interface Request {
        user: UserData
        cookies: Cookies
    }
}

interface User {
    id: string
    steamID?: string
    username: string
    role: string
    jwtEpoch: string
    extraPerm: string
    password?: string
    email?: string
}
