<script context="module">
    import { fly } from 'svelte-transitions'
    import { userStore } from '~/stores'
    import { validateEmail } from '~/utils/ui-utils.ts'
    import Error from '~/components/Layout/Form/Error'
</script>

<script>
    import Button from '~/components/Layout/Button/Button.svelte'

    let form
    let username = ''
    let password = ''
    let password_confirm = ''
    let email = ''
    let error = null

    function validateForm() {
        if (username == '' || email == '' || password == '' || password_confirm == '')
            return 'Please ensure all fields are completed'
        if (username.length > 25) return 'Username cannot be longer than 25 characters'
        if (!validateEmail(email)) return 'Invalid email'
        if (password != password_confirm) return 'Passwords do not match'

        return true
    }

    async function submit(event) {
        error = null

        if (validateForm() !== true) {
            error = validateForm()
            return
        }

        // const register = await userStore.register(username, password, email)
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
                <label style="display:none;">Register</label>
                <input placeholder="Username" name="username" bind:value={username} />
                <input placeholder="Email" type="email" name="email" bind:value={email} />
                <input placeholder="Password" type="password" name="password" bind:value={password} />
                <input
                    placeholder="Confirm Password"
                    type="password"
                    name="password_confirm"
                    bind:value={password_confirm} />
                {#if error}
                    <Error message={error} />
                {/if}
                <div class="loginRow">
                    <Button text="REGISTER" type="submit" icon="user-astronaut" color="yellow" />
                </div>
            </div>
        </form>
    </div>
</article>
