import * as sapper from '@sapper/app'

// Curried callback wrapper function for passing to component
const goto = (path:string) => {
    return () => {
        sapper.goto(path)
    }
}

export { goto }
