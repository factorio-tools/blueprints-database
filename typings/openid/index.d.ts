declare module 'openid' {
    import { IncomingMessage } from 'http'

    class RelyingParty {
        public constructor(returnUrl: string, realm: string, stateless: boolean, strict: boolean, extensions: [])

        public authenticate(
            identifier: string,
            immediate: boolean,
            callback: (error: { message: string }, authUrl: string) => void
        )

        public verifyAssertion(
            requestOrUrl: IncomingMessage | string,
            callback: (
                error: { message: string },
                result: { authenticated: boolean; claimedIdentifier: string }
            ) => void
        )
    }
    export { RelyingParty }
}
