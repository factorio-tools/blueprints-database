<script>
    import StatItem from './parts/StatItem.svelte'
    import { goto } from '../../utils/ui-utils.ts'
</script>

<style lang="scss">
    article {
        background: rgba(0, 0, 0, 0.2);
        padding: 19px 19px 15px 19px;
        width: 370px;
    }
    h2 {
        font-size: 25px;
        font-weight: 700;
        margin-bottom: 7px;
        margin-top: 0px;
        overflow: hidden;
        white-space: nowrap;
    }
    .social_bar {
        display: flex;
        margin-bottom: 10px;
    }
    p {
        font-size: 13px;
        font-weight: 300;
        color: #cacbcc;
        margin-bottom: 13px;
        margin-top: 0px;
        height: 28px;
        overflow: hidden;
    }
    img {
        width: 333px;
        height: 333px;
        margin-bottom: 5px;
    }
    .meta_bar {
        display: flex;
    }
</style>

<article>
    <header>
        <h2>Modular Starter Base</h2>
    </header>
    <section class="social_bar">
        <StatItem text="22" icon="heart" color="#bb81ac" />
        <StatItem text="457" icon="arrow-alt-circle-down" color="#86abc6" />
        <StatItem
            onClick={goto('/blog')}
            text="LarryCarryOW"
            icon="user-astronaut"
            faPrefix="fas"
            color="#a0c488"
            type="link" />
    </section>
    <p>Chunk Size Starter Base (Designed for Nanobots, but also applicable for Vanilla)</p>
    <section class="thumbnail">
        <img alt="Blueprint Test" src="/print_test.jpg" />
    </section>
    <section class="meta_bar">
        <StatItem text="v0.17" icon="code-branch" faPrefix="fas" type="meta" />
        <StatItem text="Early game" icon="rocket" faPrefix="fas" type="meta" />
        <StatItem text="No mods required" icon="dice-d20" faPrefix="fas" type="meta" />
    </section>
</article>
