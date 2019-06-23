<template>
  <v-container class="app-main">
    <v-card class="ls-card" elevation="3" :flat="$vuetify.breakpoint.xsOnly">
      <v-card-title primary-title>
        <h1>Changelog</h1>
      </v-card-title>
      <v-card-text id="markdown_content">
        <vue-markdown :source="changelog" :anchor-attributes="anchor_attrs" :breaks="false" :postrender="postrender"></vue-markdown>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import {VERSION} from '../../constants';
  import utils from '../../utils';
  import VueMarkdown from 'vue-markdown';

  export default {
    name: "changelog",
    components: {
      VueMarkdown
    },
    data() {
      return {
        VERSION: VERSION,
        changelog: 'Loading...',
        anchor_attrs: {
          rel: 'noopener noreferrer nofollow'
        },
        page: {
          title: 'Changelog',
          description: 'See the changelog of AUR Browser. Always know what changed!'
        }
      }
    },
    mounted() {
      import('../../../CHANGELOG.md').then(res => this.changelog = res.default.replace('# Changelog\n', ''));
    },
    methods: {
      postrender: utils.markdown.postrender
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
