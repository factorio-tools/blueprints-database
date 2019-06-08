<script>
    import { setClient } from 'svelte-apollo'

    import { client } from '../graphql/client.ts'

    import Header from '../components/Layout/Header/Header.svelte'
    import Footer from '../components/Layout/Footer/Footer.svelte'

    // Client gets passed down to all children. Only need this once
    setClient(client)
    export let segment
</script>

<style lang="scss">
    // Font awesome in-lining for a little SEO help
    @font-face {
        font-family: 'Font Awesome 5 Free';
        font-style: normal;
        font-weight: 400;
        font-display: auto;
        src: url(/webfonts/fa-regular-400.eot);
        src: url(/webfonts/fa-regular-400.eot?#iefix) format('embedded-opentype'),
            url(/webfonts/fa-regular-400.woff2) format('woff2'), url(/webfonts/fa-regular-400.woff) format('woff'),
            url(/webfonts/fa-regular-400.ttf) format('truetype'),
            url(/webfonts/fa-regular-400.svg#fontawesome) format('svg');
    }
    @font-face {
        font-family: 'Font Awesome 5 Free';
        font-style: normal;
        font-weight: 900;
        font-display: auto;
        src: url(/webfonts/fa-solid-900.eot);
        src: url(/webfonts/fa-solid-900.eot?#iefix) format('embedded-opentype'),
            url(/webfonts/fa-solid-900.woff2) format('woff2'), url(/webfonts/fa-solid-900.woff) format('woff'),
            url(/webfonts/fa-solid-900.ttf) format('truetype'),
            url(/webfonts/fa-solid-900.svg#fontawesome) format('svg');
    }
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
