<script>
  import Button from '~/components/Layout/Button/Button.svelte'
</script>

<style lang="scss">
    footer {
        width: 100%;
        max-width: 1614px;
        padding: 80px 19px;
        margin: 0 auto;
        text-align: center;
    }
    footer div.sitemap a {
        text-transform: uppercase;
        border: 0;
        margin: 10px 24px 10px 18px;
        display: inline-block;
        font-size: 22px;
        font-weight: 400;
        line-height: 19px;
        height: 43px;
        color: #ffffff;
        font-family: 'Teko', sans-serif;
    }
    footer div.legal {
         color: #ccc;
         font-size: 80%;
    }
</style>

<footer>
    <div class="sitemap">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/blueprint/add">Add Blueprint</a>
      <a href="/contact">Contact Us</a>
    </div>
    <div class="legal">
        &copy; Factorio.tools 2019
    </div>
</footer>
