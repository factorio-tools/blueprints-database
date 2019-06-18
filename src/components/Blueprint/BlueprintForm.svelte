<script>
    import { blueprintPreviewStore as bppStore } from '~/stores'

    const handleChange = e => {
        bppStore.setState({ title: e.target.value || bppStore.defaultProps.title })
    }
</script>

<style lang="scss">
    form {
        background: rgba(14, 20, 27, 0.8);
        margin-left: 16px;
        flex: 1;
    }
    header {
        background: rgba(6, 9, 13, 0.7);
        padding: 15px 19px;
    }
    h2 {
        margin: 0;
        font-size: 26px;
        font-weight: 500;
    }
    input {
        background: rgba(0, 0, 0, 0.2);
        color: #dedede;
        border: 1px solid #3e4349;
        padding: 15px;
        outline: none;
        width: 100%;
    }
    .formWrapper {
        padding: 25px 19px;
    }
    label {
        font-size: 21px;
        color: #ffffff;
        font-weight: 700;
        margin-bottom: 10px;
        font-family: 'Teko', sans-serif;
        display: block;
    }
</style>

<form autocomplete="off">
    <header>
        <h2>ADD BLUEPRINT</h2>
    </header>
    <div class="formWrapper">
        <label for="bpTitle">Title</label>
        <input placeholder="Short title of my blueprint" name="bpTitle" on:input={handleChange} />
    </div>
</form>
