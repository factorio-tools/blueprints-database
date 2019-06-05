import { Database as ArangoDatabase } from 'arangojs'

declare module 'orango' {
    interface Defaults {
        DATABASE: string
        URL: string
        USERNAME: string
        PASSWORD: string
    }

    interface ConnectOptions {
        url?: string
        username?: string
        password?: string
    }

    class Orango {
        public static get(database?: string): Orango

        public constructor(database?: string): Orango

        public get(database?: string): Orango

        public connect(options: ConnectOptions = {}): Promise<Connection>
    }

    class Connection {
        public connected: boolean
        public url: string
        public username: string
        public password: string
        public db: ArangoDatabase

        public async connect(name?: string, options: ConnectOptions = {}): this
    }

    export default new Orango()
}
