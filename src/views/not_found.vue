<template>
  <div class="section no-pad-bot" id="index-banner">
    <div class="container">
      <br/>
      <br/>
      <h1 class="header center blue-grey-text text-lighten-4">404 not found!</h1>
      <div class="row center">
        <h5 id="error_details" class="header col s12 light white-text">Sorry but you are not on the good page. :c</h5>
      </div>
      <br/>
      <div class="row center">
        <a href="/" class="ls-btn ls-pulse" ls-variant="contained" style="z-index: 0;">Main page</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "not_found.vue",
    head: {
      title() {
        return {
          inner: 'AUR Browser',
          separator: '-',
          complement: '404'
        };
      },
      meta() {
        return [
          {name: 'description', c: 'A page which doesn\'t exist.', id: 'desc'},
          {p: 'og:title', c: 'AUR Browser - 404'},
          {p: 'og:url', c: window.location.href},
          {p: 'og:description', c: 'A page which doesn\'t exist.'}
        ]
      }
    }
  }
</script>

<style scoped>

</style>
