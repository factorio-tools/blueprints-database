<script context="module">
    import { initGQLClient } from '../graphql/client'
    import { userStore } from '../stores'
    export async function preload(page, session) {
        const { user, authToken } = session
        initGQLClient(authToken)
        userStore.setState(user)
    }
</script>

<script>
    import Header from '../components/Layout/Header/Header.svelte'
    import Footer from '../components/Layout/Footer/Footer.svelte'
    initGQLClient()
    export let segment
</script>

<style lang="scss">
    :global(.far) {
        font-family: 'Font Awesome 5 Free';
        font-weight: 400;
    }
    :global(.fa, .fas) {
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
    }
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
