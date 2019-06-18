<script context="module">
    import { userStore } from '~/stores'

    export async function preload(page, session) {
        let user = {}

        userStore.subscribe(value => {
            user = value
        })()

        if (!user.username) {
            return this.redirect(302, `/?redirect=${page.path}`)
        }
    }
</script>

<script>
    import { blueprintPreviewStore } from '~/stores'
    import BlueprintPreview from '~/components/Blueprint/BlueprintPreview.svelte'
    import BlueprintForm from '~/components/Blueprint/BlueprintForm.svelte'
</script>

<style lang="scss">
    article {
        max-width: 1123px;
        width: 100%;
        margin: 0 auto;
        display: flex;
    }
</style>

<svelte:head>
    <title>Add Blueprint</title>
</svelte:head>

<article>
    <BlueprintPreview title={$blueprintPreviewStore.title} username={$userStore.username} />
    <BlueprintForm />
</article>
