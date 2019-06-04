<script lang="typescript">
    export let segment
</script>

<style lang="scss">
    @import 'components/Nav';
</style>

<nav>
    <ul>
        <li>
            <a class={segment === undefined ? 'selected' : ''} href=".">home</a>
        </li>
        <li>
            <a class={segment === 'about' ? 'selected' : ''} href="about">about</a>
        </li>

        <!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
        <li>
            <a rel="prefetch" class={segment === 'blog' ? 'selected' : ''} href="blog">blog</a>
        </li>
    </ul>
</nav>
