import { query, mutate } from 'svelte-apollo'
import { writable } from 'svelte/store'
import { client } from './graphql/client'
import { USER_LOGIN, USER_LOGOUT } from './graphql/queries.gql'

interface CreateBlueprintPreviewProps {
    title: string
}

interface UserProps {
    username: string
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
        id: '',
        role: '',
        perm: []
    }
    const { subscribe, set, update } = writable({ ...defaultProps })

    return {
        subscribe,
        defaultProps,
        logout: async () => {
            try {
                await mutate(client, {
                    mutation: USER_LOGOUT
                })
                set({ ...defaultProps })
            } catch (error) {
                console.log(error)
            }
        },
        login: async () => {
            try {
                const user = await mutate(client, {
                    mutation: USER_LOGIN,
                    variables: { username: 'username00', password: '1234' }
                })
                if (user.errors) {
                    console.log(user.errors)
                } else {
                    set({ ...user.data.login })
                }
            } catch (error) {
                console.log(error)
            }
        },
        setState: (newState: UserProps) => set({ ...newState }),
        reset: () => set({ ...defaultProps })
    }
}

const blueprintPreviewStore = createBlueprintPreviewStore()
const userStore = createUserStore()

export { blueprintPreviewStore, userStore }
