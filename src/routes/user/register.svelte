<script context="module">
    import { fly } from 'svelte-transitions'
    import { userStore } from '~/stores'
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
    let confirmPassword = ''
    let email = ''
    let errors = []

    function submit() {
        userStore
            .register(username, password, confirmPassword, email)
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

    p {
        opacity: 0.7;
        margin: 0;
        margin-top: 6px;
        font-size: 13px;
    }
</style>

<svelte:head>
    <title>Register</title>
</svelte:head>

<article in:fly={{ y: 20 }}>
    <div class="login">
        <form on:submit|preventDefault={submit} bind:this={form}>
            <header>
                <h2>REGISTER</h2>
                <p>Upload blueprints and be notified of updates to your favorites!</p>
            </header>
            <div class="formWrapper">
                {#if errors.length !== 0}
                    {#each errors as error}
                        <Error message={error} />
                    {/each}
                {/if}
                <label style="display:none;">Register</label>
                <input placeholder="Username" name="username" bind:value={username} />
                <input placeholder="Email" type="email" name="email" bind:value={email} />
                <input placeholder="Password" type="password" name="password" bind:value={password} />
                <input
                    placeholder="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    bind:value={confirmPassword} />
                <div class="loginRow">
                    <Button text="REGISTER" type="submit" icon="user-astronaut" color="yellow" />
                </div>
            </div>
        </form>
    </div>
</article>
