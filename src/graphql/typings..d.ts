interface GQLContext {
    user: User
    req: Express.Request
    res: Express.Response
}

interface User {
    id: string
    steamID?: string
    username: string
    displayname: string
    role: string
    jwtEpoch: string
    extraPerm: string[]
    password?: string
    email?: string
}

// Subset of User
interface UserData {
    id: string
    role: string
    extraPerm: string[]
    username: string
    displayname: string
}
