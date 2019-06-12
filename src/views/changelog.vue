<template>
  <div class="app-main">
  </div>
</template>

<script>
  import CONSTANTS from "../constants";

  export default {
    name: "changelog",
    data() {
      return {
        VERSION: CONSTANTS.VERSION,
        page: {
          title: 'Changelog',
          description: 'See the changelog of AUR Browser. Always know what changed!'
        }
      }
    },
    head: {
      title() {
        return {
          inner: 'AUR Browser',
          separator: '-',
          complement: this.page.title
        };
      },
      meta() {
        return [
          {name: 'description', c: this.page.description, id: 'desc'},
          {p: 'og:title', c: `AUR Browser - ${this.page.title}`},
          {p: 'og:url', c: window.location.href},
          {p: 'og:description', c: this.page.description}
        ]
      }
    }
  }
</script>

<style scoped>
  .icon-block img.responsive-img {
    max-width: 45px;
  }
</style>