<script>
    import { fly } from 'svelte-transitions'
    import { blueprintPreviewStore as bppStore } from '~/stores'

    const handleChange = e => {
        bppStore.setState({ title: e.target.value || bppStore.defaultProps.title })
    }
</script>

<style lang="scss">
    @import 'components/styles/form.scss';
</style>

<form in:fly={{ y: 80 }} autocomplete="off">
    <header>
        <h2>ADD BLUEPRINT</h2>
    </header>
    <div class="formWrapper">
        <label for="bpTitle">Title</label>
        <input placeholder="Short title of my blueprint" name="bpTitle" on:input={handleChange} />
    </div>
</form>
