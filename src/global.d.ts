declare namespace NodeJS {
    import fetch from 'node-fetch'
    interface Global {
        fetch: fetch
    }
}
