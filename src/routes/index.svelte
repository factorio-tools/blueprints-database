<script context="module">
    import { HOME_ALL } from '~/graphql/queries.gql'
    import { client } from '~/graphql/client'

    // Query everything needed for entire route into preload here.
    // Then future data can be queried against the cache
    // So each main page route will load all data this way
    export async function preload(page, session) {
        return {
            cache: await client.query({
                query: HOME_ALL
            })
        }
    }
</script>

<script>
    import { fade } from 'svelte-transitions'
    import { restore, query } from 'svelte-apollo'
    import Posts from '~/components/Posts/Posts.svelte'
    import { GET_FAVORITES } from '~/graphql/queries.gql'

    export let cache

    // Init data from cache
    restore(client, HOME_ALL, cache.data)

    // query a subset of the preloaded data (using dummy favorites as an example)
    const favorites = query(client, { query: GET_FAVORITES })
</script>

<svelte:head>
    <title>Factorio Blueprint Database | Factorio Tools</title>
</svelte:head>

<div in:fade>
    <h1>Test staging!</h1>

    <!-- Component example-->
    <Posts />

    <!-- Inline example-->
    <h3>Favorites:</h3>
    <!-- Note $ sign needed here to correctly refresh this once promise resolves -->
    {#await $favorites}
        Loading won't be shown if preloaded
    {:then result}
        <ul>
            {#each result.data.favorites as favorite}
                <li>
                    <b>{favorite.title}</b>
                </li>
            {/each}
        </ul>
    {:catch error}
        <p>Error preloading favorites: {error}</p>
    {/await}
</div>
