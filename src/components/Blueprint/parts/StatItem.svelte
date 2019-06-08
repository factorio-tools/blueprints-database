<script>
    export let text = '',
        icon = '',
        color = '#7f8587',
        faPrefix = 'far',
        onClick = null,
        type = ''
</script>

<style lang="scss">
    .social_item {
        margin-right: 13px;
    }
    i {
        font-size: 16px;
        margin-right: 1px;
    }
    span {
        font-weight: 400;
        font-size: 17px;
        font-family: 'Teko', sans-serif;
        vertical-align: middle;
        color: #c5c6c7;
        transition: color 0.2s;
    }
    .meta i {
        font-size: 11px;
    }
    .meta span {
        color: #7f8587;
        font-size: 15px;
        vertical-align: baseline;
    }
    .link {
        cursor: pointer;
    }
    .link:hover span {
        color: #ffffff;
    }
</style>

<div on:click={onClick} class="social_item {type}">
    <i style="color: {color}" class="{faPrefix} fa-{icon}" />
    <span>{text}</span>
</div>
