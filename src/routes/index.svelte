<script lang="typescript">
    import { getClient, query } from 'svelte-apollo'
    import { gql } from 'apollo-boost'

    const GET_POSTS = gql`
        {
            posts {
                title
                author {
                    firstName
                    lastName
                }
            }
        }
    `

    const client = getClient()

    const books = query(client, { query: GET_POSTS })
</script>

<style lang="scss">
    h1,
    figure,
    p {
        text-align: center;
        margin: 0 auto;
    }

    h1 {
        font-size: 2.8em;
        text-transform: uppercase;
        font-weight: 700;
        margin: 0 0 0.5em 0;
    }

    figure {
        margin: 0 0 1em 0;
    }

    img {
        width: 100%;
        max-width: 400px;
        margin: 0 0 1em 0;
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
    <title>Sapper project template</title>
</svelte:head>

<h1>Test staging!</h1>

<figure>
    <img alt="Borat" src="great-success.png" />
    <figcaption>HIGH FIVE!</figcaption>
</figure>

<p>
    <strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong>
</p>

<h3>GraphQL Test:</h3>
{#await $books}
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
