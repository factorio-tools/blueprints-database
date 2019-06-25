import * as sapper from '@sapper/app'
import { query, mutate } from 'svelte-apollo'
import { writable } from 'svelte/store'
import { validate } from 'class-validator'
import { GraphQLError } from 'graphql'
import { client } from './graphql/client'
import { USER_LOGIN, USER_LOGOUT, USER_REGISTER_WITH_STEAM, USER_REGISTER } from './graphql/queries.gql'
import { LoginInput, RegisterInput, RegisterWithSteamInput } from './graphql/resolvers/userInputTypes'

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

    const parseGQLErrors = (errors: readonly GraphQLError[]): string[] =>
        errors.flatMap(e => {
            if (e.extensions && e.extensions.code === 'ARRAY_OF_ERRORS') return e.message.split('\n')
            else return e.message
        })

    // eslint-disable-next-line @typescript-eslint/ban-types
    const getInputErrors = <T extends Object>(classType: new () => T, inputVars: Record<string, unknown>) => {
        const input = Object.assign(new classType(), inputVars)
        return validate(input).then(inputErrors => inputErrors.flatMap(e => Object.values(e.constraints)))
    }

    return {
        subscribe,
        defaultProps,

        logout: () =>
            mutate(client, {
                mutation: USER_LOGOUT
            }).then(({ errors }) => {
                if (errors) {
                    throw parseGQLErrors(errors)
                } else {
                    set({ ...defaultProps })
                    // TODO: check if current route should still be avalible
                    // if not only then redirect to /
                    sapper.goto('/')
                }
            }),

        login: async (username: string, password: string) => {
            const inputVars = { username, password }

            const inputErrors = await getInputErrors(LoginInput, inputVars)
            if (inputErrors.length !== 0) throw inputErrors

            return mutate(client, {
                mutation: USER_LOGIN,
                variables: inputVars
            }).then(({ errors, data }) => {
                if (errors) {
                    throw parseGQLErrors(errors)
                } else {
                    set({ ...data.login })
                }
            })
        },

        registerSteam: async (username: string, email: string) => {
            const inputVars = { username, email }

            const inputErrors = await getInputErrors(RegisterWithSteamInput, inputVars)
            if (inputErrors.length !== 0) throw inputErrors

            return mutate(client, {
                mutation: USER_REGISTER_WITH_STEAM,
                variables: inputVars
            }).then(({ errors, data }) => {
                if (errors) {
                    throw parseGQLErrors(errors)
                } else {
                    set({ ...data.registerWithSteam })
                }
            })
        },

        register: async (username: string, password: string, confirmPassword: string, email: string) => {
            const inputVars = { username, password, confirmPassword, email }

            const inputErrors = await getInputErrors(RegisterInput, inputVars)
            if (inputErrors.length !== 0) throw inputErrors

            return mutate(client, {
                mutation: USER_REGISTER,
                variables: inputVars
            }).then(({ errors, data }) => {
                if (errors) {
                    throw parseGQLErrors(errors)
                } else {
                    set({ ...data.register })
                }
            })
        },

        setState: (newState: UserProps) => set({ ...newState }),

        reset: () => set({ ...defaultProps })
    }
}

const blueprintPreviewStore = createBlueprintPreviewStore()
const userStore = createUserStore()

export { blueprintPreviewStore, userStore }
