<script>
    import * as sapper from '@sapper/app'

    export let text = '',
        href = undefined,
        onClick = undefined,
        icon,
        color = '',
        size = '',
        type = 'button',
        faPrefix = 'fas',
        nav = undefined

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
        height: 43px;

        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        display: inline-block;
        position: relative;
        outline: none;
    }

    button:not(.nav):hover {
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

    :global(.buttonNav) {
        position: absolute;
        left: 0;
        top: 43px;
        background: rgba(0, 0, 0, 0.4);
        width: 100%;
        min-width: 108px;
        padding: 10px 0;
        display: none;
    }
    :global(.buttonNav:hover) {
        display: block;
    }

    button:hover :global(.buttonNav) {
        display: block;
    }

    :global(.buttonNav ul) {
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0;
        margin: 0;
        text-align: left;
    }
    :global(.buttonNav li) {
        font-size: 19px;
        font-family: 'Teko', sans-serif;
        margin: 0;
        padding: 12px 19px 8px 19px;
        width: 100%;
        transition: all 0.1s;
        white-space: nowrap;
    }
    :global(.buttonNav li:hover) {
        background-color: #ffc73f;
        color: #02050a;
        font-size: 22px;
    }
</style>

<button on:click={e => handleClick(e)} class="{color} {size} {nav && 'nav'}" {type}>
    {#if icon}
        <i class="{faPrefix} fa-{icon}" />
    {/if}
    <span>{text}</span>
    {#if nav}
        <slot name="nav" />
    {/if}

</button>
