<script>
    import { query } from 'svelte-apollo'
    import { GET_POSTS } from '../../graphql/queries.gql'
    import { client } from '../../graphql/client'

    // Query prelaoded data from cache
    const posts = query(client, { query: GET_POSTS })
</script>

<h3>GraphQL Test:</h3>
{#await $posts}
    Loading...
{:then result}
    <ul>
        {#each result.data.posts as post}
            <li>
                <b>{post.title}</b>
                by {post.author.firstName} {post.author.lastName}
            </li>
        {/each}
    </ul>
{:catch error}
    Error: {error}
{/await}
