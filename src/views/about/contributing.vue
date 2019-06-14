<template>
  <div class="app-main">
  </div>
</template>

<script>
  import CONSTANTS from "../../constants";

  export default {
    name: "contributing",
    data() {
      return {
        VERSION: CONSTANTS.VERSION,
        page: {
          title: 'Contributing',
          description: 'See the contributing guidelines.'
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
</style>
