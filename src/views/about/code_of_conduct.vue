<template>
  <v-container class="app-main">
    <v-card color="ls-card grey darken-1" elevation="3" :flat="$vuetify.breakpoint.xsOnly">
      <v-card-title>
        <h1>Contributor Covenant Code of Conduct</h1>
      </v-card-title>
      <v-card-text id="content">
        <vue-markdown :source="code_of_conduct" :breaks="false"></vue-markdown>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import CONSTANTS from "../../constants";
  import VueMarkdown from 'vue-markdown';
  import axios from 'axios';

  const markdown = require('../../../CODE_OF_CONDUCT.md');

  export default {
    name: "code_of_conduct",
    components: {
      VueMarkdown
    },
    data() {
      return {
        VERSION: CONSTANTS.VERSION,
        code_of_conduct: 'Loading...',
        page: {
          title: 'Code of Conduct',
          description: 'The Code of Conduct of the AUR Browser project.'
        }
      }
    },
    mounted() {
      axios.get(markdown).then(res => this.code_of_conduct = res.data.replace('# Contributor Covenant Code of Conduct\n', ''));
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
  #content {
    padding-left: 3em;
    padding-right: 3em;
  }
</style>
