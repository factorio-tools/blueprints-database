<script context="module">
    import { userStore } from '~/stores'
    import { goto } from '~/utils/ui-utils.ts'

    export async function preload(page, session) {
        let user = {}

        userStore.subscribe(value => {
            user = value
        })()

        if (user.username) {
            return this.redirect(302, `/`)
        }
    }
</script>

<script>
    import Button from '~/components/Layout/Button/Button.svelte'
    let form
    let username = ''
    let password = ''
    let errors = null

    async function submit(event) {
        const login = await userStore.login(username, password)
        console.log(login)
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

<article>
    <div class="login">
        <form on:submit|preventDefault={submit} bind:this={form} autocomplete="off">
            <header>
                <h2>LOGIN</h2>
            </header>
            <div class="formWrapper">
                <label style="display:none;">Login</label>
                <input placeholder="Username" name="username" bind:value={username} />
                <input placeholder="Password" type="password" name="password" bind:value={password} />
                <div class="loginRow">
                    <Button text="LOGIN" type="submit" icon="sign-in-alt" color="yellow" />
                    <Button text="LOGIN WITH STEAM" faPrefix="fab" icon="steam" />
                </div>

            </div>
        </form>
        <a class="register" href="#">Don't have an account? Register</a>
    </div>
</article>
