import { writable } from 'svelte/store'

interface CreateBlueprintPreviewProps {
    title: string
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

export const blueprintPreviewStore = createBlueprintPreviewStore()
