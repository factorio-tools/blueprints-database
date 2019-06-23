import * as sapper from '@sapper/app'
import { query, mutate } from 'svelte-apollo'
import { writable } from 'svelte/store'
import { client } from './graphql/client'
import { USER_LOGIN, USER_LOGOUT } from './graphql/queries.gql'

interface CreateBlueprintPreviewProps {
    title: string
}

interface UserProps {
    username: string
    displayname: string
    id: string
    role: string
    perm: string[]
}

function createBlueprintPreviewStore() {
    const defaultProps: CreateBlueprintPreviewProps = {
        title: 'Short title of my blueprint'
    }
    const { subscribe, set, update } = writable({ ...defaultProps })

    return {
        subscribe,
        defaultProps,
        setState: (newState: CreateBlueprintPreviewProps) => update(state => ({ ...state, ...newState })),
        reset: () => set({ ...defaultProps })
    }
}

function createUserStore() {
    const defaultProps: UserProps = {
        username: '',
        displayname: '',
        id: '',
        role: '',
        perm: []
    }
    const { subscribe, set, update } = writable({ ...defaultProps })

    return {
        subscribe,
        defaultProps,
        logout: async (callback?: Function) => {
            try {
                await mutate(client, {
                    mutation: USER_LOGOUT
                })
                set({ ...defaultProps })
                if (callback) callback()
                else sapper.goto('/')
            } catch (error) {
                console.log(error)
            }
        },
        login: async (username: string, password: string, redirect: string = '/') => {
            try {
                const user = await mutate(client, {
                    mutation: USER_LOGIN,
                    variables: { username, password }
                })
                if (user.errors) console.log(user.errors, 'user')
                else set({ ...user.data.login })
                sapper.goto(redirect)
            } catch (error) {
                console.log(error, 'catch')
            }
        },
        setState: (newState: UserProps) => set({ ...newState }),
        reset: () => set({ ...defaultProps })
    }
}

const blueprintPreviewStore = createBlueprintPreviewStore()
const userStore = createUserStore()

export { blueprintPreviewStore, userStore }
