<script>
    import * as sapper from '@sapper/app'

    export let text = '',
        href = undefined,
        onClick = undefined,
        icon,
        color = '',
        size = '',
        type = 'button',
        faPrefix = 'fas'

    function handleClick(e) {
        if (typeof onClick === 'function') {
            onClick()
        }
        if (href) {
            sapper.goto(href)
        }
    }
</script>

<style lang="scss">
    button {
        cursor: pointer;
        background: none;
        padding: 10px 18px 10px 18px;
        font-size: 19px;
        font-weight: 400;
        line-height: 19px;
        transition: opacity 0.2s;

        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        display: inline-block;
    }

    button:hover {
        opacity: 0.9;
    }

    button.yellow,
    button.yellow i,
    button.yellow span {
        border-color: #ffc73f;
        background: #ffc73f;
        color: #3d3116;
    }

    span {
        font-family: 'Teko', sans-serif;
        vertical-align: middle;
    }

    i {
        margin-right: 5px;
    }
</style>

<button on:click={e => handleClick(e)} class="{color} {size}" {type}>
    {#if icon}
        <i class="{faPrefix} fa-{icon}" />
    {/if}
    <span>{text}</span>
</button>
