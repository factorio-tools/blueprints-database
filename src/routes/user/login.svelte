<script context="module">
    import { userStore } from '~/stores'
    import { fly } from 'svelte-transitions'
    import Error from '~/components/Layout/Form/Error'

    export async function preload(page, session) {
        let user = {}
        userStore.subscribe(value => {
            user = value
        })()

        if (user.username) {
            return this.redirect(302, `/`)
        }

        let redirect = page.query.redirect || undefined
        return { redirect }
    }
</script>

<script>
    import { goto } from '@sapper/app'
    import Button from '~/components/Layout/Button/Button.svelte'
    export let redirect

    let form
    let username = ''
    let password = ''
    let errors = []

    function submit() {
        userStore
            .login(username, password)
            .then(() => goto(redirect || '/'))
            .catch(e => (errors = e))
    }
</script>

<style lang="scss">
    @import 'components/styles/form.scss';

    .login {
        max-width: 500px;
        margin: 60px auto;
    }

    .loginRow {
        display: flex;
        justify-content: space-between;
    }

    form {
        margin-bottom: 20px;
    }

    .register {
        padding: 18px 35px;
        font-size: 14px;
        opacity: 0.8;
    }
</style>

<svelte:head>
    <title>Login</title>
</svelte:head>

<article in:fly={{ y: 20 }}>
    <div class="login">
        <form on:submit|preventDefault={submit} bind:this={form} autocomplete="off">
            <header>
                <h2>LOGIN</h2>
            </header>
            <div class="formWrapper">
                {#if errors.length !== 0}
                    {#each errors as error}
                        <Error message={error} />
                    {/each}
                {/if}
                <label style="display:none;">Login</label>
                <input placeholder="Username" name="username" bind:value={username} />
                <input placeholder="Password" type="password" name="password" bind:value={password} />
                <div class="loginRow">
                    <Button text="LOGIN" type="submit" icon="sign-in-alt" color="yellow" />
                    <Button
                        text="LOGIN WITH STEAM"
                        href="/steamauth{redirect ? `?redirect=${redirect}` : ''}"
                        faPrefix="fab"
                        icon="steam" />
                </div>
            </div>
        </form>
        <a class="register" href="/user/register{redirect ? `?redirect=${redirect}` : ''}">
            Don't have an account? Register
        </a>
    </div>
</article>
