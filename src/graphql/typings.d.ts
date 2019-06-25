export declare global {
    import { Request, Response } from 'express'

    interface GQLContext {
        user: PublicUserData
        req: Request
        res: Response
    }

    // Subset of User
    interface PublicUserData {
        id: string
        role: string
        extraPerm: string[]
        username: string
        displayname: string
    }
}
