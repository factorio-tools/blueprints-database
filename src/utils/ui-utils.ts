import * as sapper from '@sapper/app'

// Curried callback wrapper function for passing to component
const goto = (path: string) => () => {
    sapper.goto(path)
}

const validateEmail = (email: string) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

export { goto, validateEmail }
