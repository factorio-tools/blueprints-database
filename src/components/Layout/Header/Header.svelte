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
        padding: 18px 45px 18px 0;
        margin: 15px 0;
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
    nav button {
        text-transform: uppercase;
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
        <Button text="Add Blueprint" href="/blueprint/add" icon="plus" color="yellow" />
        <Button
            text={$userStore.displayname || 'Login'}
            href={!$userStore.displayname && '/user/login'}
            icon="user-astronaut"
            nav={$userStore.displayname && true}>

            <div class="buttonNav" slot="nav">
                <ul>
                    <li>My Library</li>
                    <li>My Favorites</li>
                    <li on:click={() => userStore.logout()} class="sep">Logout</li>
                </ul>
            </div>
        </Button>
    </nav>
</header>
