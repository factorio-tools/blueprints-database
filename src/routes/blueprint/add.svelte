<script>
    import { blueprintPreviewStore } from '../../stores'
    import BlueprintPreview from '../../components/Blueprint/BlueprintPreview.svelte'
    import BlueprintForm from '../../components/Blueprint/BlueprintForm.svelte'
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
    <BlueprintPreview title={$blueprintPreviewStore.title} />
    <BlueprintForm />
</article>
