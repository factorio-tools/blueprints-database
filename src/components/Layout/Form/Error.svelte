<script>
    import { fly } from 'svelte-transitions'
    export let message
</script>

<style lang="scss">
    div {
        padding: 10px;
        margin-bottom: 14px;
        background: rgba(255, 63, 79, 0.4);
        border-top: 3px solid rgba(255, 63, 79, 0.4);
        color: #fdf9f9;
        font-size: 13px;
    }
</style>

<div in:fly={{ y: 20 }}>{message}</div>
