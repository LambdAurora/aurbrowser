<template>
  <v-container class="app-main">
    <v-card color="ls-card grey darken-1" elevation="3" :flat="$vuetify.breakpoint.xsOnly">
      <v-card-title>
        <h1>Contributing to AUR Browser</h1>
      </v-card-title>
      <v-card-text>
        <vue-markdown :source="contributing" :breaks="false"></vue-markdown>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import CONSTANTS from "../../constants";
  import VueMarkdown from 'vue-markdown';
  import axios from 'axios';

  const markdown = require('../../../CONTRIBUTING.md');

  export default {
    name: "contributing",
    components: {
      VueMarkdown
    },
    data() {
      return {
        VERSION: CONSTANTS.VERSION,
        contributing: 'Loading...',
        page: {
          title: 'Contributing',
          description: 'See the contributing guidelines.'
        }
      }
    },
    mounted() {
      axios.get(markdown).then(res => this.contributing = res.data.replace('# Contributing to AUR Browser\n', '')
        .replaceAll('https://github.com/LambdAurora/aurbrowser/blob/master/CODE_OF_CONDUCT.md', '/about/code_of_conduct'));
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
