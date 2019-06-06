<script context="module">
    import { HOME_ALL } from '../data/queries.ts'
    import { client } from '../data/client.ts'

    // Query everything needed for entire route into preload here.
    // Then future data can be queried against the cache
    // So each main page route will load all data this way
    export async function preload() {
        return {
            cache: await client.query({
                query: HOME_ALL
            })
        }
    }
</script>

<script>
    import { restore, query } from 'svelte-apollo'
    import Posts from '../components/Posts/Posts.svelte'
    import { GET_FAVORITES } from '../data/queries.ts'

    export let cache

    // Init data from cache
    restore(client, HOME_ALL, cache.data)

    // query a subset of the preloaded data (using dummy favorites as an example)
    const favorites = query(client, { query: GET_FAVORITES })
</script>

<svelte:head>
    <title>Factorio Blueprint Database | Factorio Tools</title>
</svelte:head>

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
