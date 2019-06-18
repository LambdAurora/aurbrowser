<template>
  <li v-if="!dark" class="collection-item grey lighten-4">
    <slot></slot>
  </li>
  <li v-else class="collection-item grey darken-2">
    <slot></slot>
  </li>
</template>

<script>
  export default {
    name: "collection_item",
    props: {
      dark: Boolean
    }
  }
</script>

<style scoped>
</style>
