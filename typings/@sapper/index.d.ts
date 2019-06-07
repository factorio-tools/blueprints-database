/* eslint-disable import/group-exports */

declare module '@sapper/app' {
    // from sapper/runtime/src/app/types.ts
    // sapper doesn't export its types yet
    interface Redirect {
        statusCode: number
        location: string
    }
    // end

    function goto(href: string, opts = { replaceState: false }): Promise<unknown>
    function prefetch(href: string): Promise<{ redirect?: Redirect; data?: unknown }>
    function prefetchRoutes(pathnames: string[]): Promise<unknown>
    function start(opts: { target: Node }): Promise<unknown>
    const stores: () => unknown

    export { goto, prefetch, prefetchRoutes, start, stores }
}

declare module '@sapper/server' {
    import { ClientRequest, ServerResponse } from 'http'
    import { RequestHandler } from 'express'

    // from sapper/runtime/src/server/middleware/types.ts
    // sapper doesn't export its types yet
    interface Req extends ClientRequest {
        url: string
        baseUrl: string
        originalUrl: string
        method: string
        path: string
        params: Record<string, string>
        query: Record<string, string>
        headers: Record<string, string>
    }
    interface Res extends ServerResponse {
        write: (data: unknown) => void
    }
    // end

    interface MiddlewareOptions {
        session?: (req: Req, res: Res) => unknown
        ignore?: unknown
    }

    function middleware(opts: MiddlewareOptions = {}): RequestHandler

    export { middleware }
}

declare module '@sapper/service-worker' {
    const timestamp: number
    const files: string[]
    const shell: string[]
    const routes: { pattern: RegExp }[]

    export { timestamp, files, files as assets, shell, routes }
}
