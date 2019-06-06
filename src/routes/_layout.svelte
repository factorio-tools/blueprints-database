<script>
    import ApolloClient from 'apollo-client'
    import { setClient } from 'svelte-apollo'

    import { client } from '../data/client.js'

    import Header from '../components/Layout/Header/Header.svelte'
    import Footer from '../components/Layout/Footer/Footer.svelte'

    // Client gets passed down to all children. Only need this once
    setClient(client)
    export let segment
</script>

<style lang="scss">
    :global(*) {
        box-sizing: border-box;
        color: #ffffff;
        font-family: 'Roboto', sans-serif;
    }
    :global(body) {
        background: url('/layout_bg.jpg') center top no-repeat #0e1721;
    }
    :global(h1, h2, h3, h4, h5, h6) {
        font-family: 'Teko', sans-serif;
    }
    :global(a) {
        text-decoration: none;
        color: #ffffff;
    }
    main {
        width: 100%;
        max-width: 1614px;
        padding: 0 19px;
        margin: 0 auto;
    }
</style>

<Header {segment} />

<main>
    <slot />
</main>

<Footer />
