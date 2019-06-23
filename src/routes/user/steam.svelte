<script context="module">
    import { fly } from 'svelte-transitions'
    import { userStore } from '~/stores'
    import { validateEmail } from '~/utils/ui-utils.ts'
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
    import Button from '~/components/Layout/Button/Button.svelte'
    export let redirect

    let form
    let username = ''
    let email = ''
    let error = null

    function validateForm() {
        if (username == '') return 'Please pick a username'
        if (username.length > 25) return 'Username cannot be longer than 25 characters'
        if (email != '' && !validateEmail(email)) return 'Invalid email'

        return true
    }

    async function submit(event) {
        error = null

        if (validateForm() !== true) {
            error = validateForm()
            return
        }

        const register = await userStore.registerSteam(username, email, redirect)
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
    <title>Register with Steam</title>
</svelte:head>

<article in:fly={{ y: 20 }}>
    <div class="login">
        <form on:submit|preventDefault={submit} bind:this={form}>
            <header>
                <h2>COMPLETE STEAM REGISTRATION</h2>
                <p>Upload blueprints and be notified of updates to your favorites!</p>
            </header>
            <div class="formWrapper">
                {#if error}
                    <Error message={error} />
                {/if}
                <label style="display:none;">Register</label>
                <input placeholder="Pick a username" name="username" bind:value={username} />
                <input placeholder="Email (optional)" type="email" name="email" bind:value={email} />
                <div class="loginRow">
                    <Button text="REGISTER" type="submit" icon="user-astronaut" color="yellow" />
                </div>
            </div>
        </form>
    </div>
</article>
