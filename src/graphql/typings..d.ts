interface GQLContext {
    user: User
    req: Express.Request
    res: Express.Response
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

interface UserData {
    id: string
    role: string
    perm: string
    username: string
}
