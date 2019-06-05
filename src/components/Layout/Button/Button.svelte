<script>
    export let text = '',
        href = '#',
        onClick,
        icon,
        color = '',
        size = '',
        faPrefix = 'fas'
</script>

<style lang="scss">
    a {
        padding: 13px 18px 10px 18px;
        font-size: 19px;
        font-weight: 400;
        line-height: 19px;
        transition: opacity 0.2s;

        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    a:hover {
        opacity: 0.9;
    }

    a.yellow,
    a.yellow i,
    a.yellow span {
        border: none;
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

<a on:click={onClick} class="{color} {size}" {href}>
    {#if icon}
        <i class="{faPrefix} fa-{icon}" />
    {/if}
    <span>{text}</span>
</a>
