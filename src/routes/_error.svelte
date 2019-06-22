<script>
    import { stores } from '@sapper/app'
    const { session } = stores()

    let devEnv = false

    session.subscribe(value => {
        devEnv = value.devEnv
    })

    export let status
    export let error
</script>

<style>
    h1,
    p {
        margin: 0 auto;
    }

    h1 {
        font-size: 2.8em;
        font-weight: 700;
        margin: 0 0 0.5em 0;
    }

    p {
        margin: 1em auto;
    }

    @media (min-width: 480px) {
        h1 {
            font-size: 4em;
        }
    }
</style>

<svelte:head>
    <title>{status}</title>
</svelte:head>

<h1>{status}</h1>

<p>{error.message}</p>

{#if devEnv && error.stack}
    <pre>{error.stack}</pre>
{/if}
