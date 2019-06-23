<script>
    import Button from '~/components/Layout/Button/Button.svelte'
    import { userStore } from '~/stores'
    export let segment
</script>

<style lang="scss">
    header {
        width: 100%;
        max-width: 1614px;
        padding: 0 19px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .logo_container {
        display: flex;
        align-items: center;
    }
    img {
        width: 100%;
        max-width: 157px;
        padding: 30px 45px 30px 0;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
        box-sizing: content-box;
    }
    #logo {
        width: 400px;
    }
    h1 {
        text-decoration: none;
        text-transform: uppercase;
        font-weight: 300;
        font-size: 34px;
        margin: 0 40px;
    }
    nav > :global(button) {
        margin-left: 15px;
    }
</style>

<header>
    <div class="logo_container">
        <a href="/">
            <img src="/factorio_tools_logo.svg" alt="Factorio Tools" id="logo" />
        </a>
        <a href="/">
            <h1>Blueprints Database</h1>
        </a>
    </div>
    <nav>
        <Button text="ADD BLUEPRINT" href="/blueprint/add" icon="plus" color="yellow" />
        <Button text={$userStore.username || 'Login'} href="/user/login" icon="user-astronaut" />
    </nav>
</header>

<!-- <nav>
    <ul>
        <li>
            <a class={segment === undefined ? 'selected' : ''} href=".">home</a>
        </li>
        <li>
            <a class={segment === 'about' ? 'selected' : ''} href="about">about</a>
        </li>
        <li>
            <a rel="prefetch" class={segment === 'blog' ? 'selected' : ''} href="blog">blog</a>
        </li>
    </ul>
</nav> -->
