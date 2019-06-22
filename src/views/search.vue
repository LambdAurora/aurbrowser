<template>
  <div>
    <div class="row">
      <v-layout v-bind:class="{'grey lighten-2 elevation-2': !dark_theme, 'grey darken-2 elevation-2': dark_theme}" row wrap style="padding: 0 .75rem .5rem;">
        <v-flex class="xs3">
          <v-combobox v-model="search_data.by" v-on:input="search" type="button" :items="search_by_items" label="Search by:" hide-details></v-combobox>
        </v-flex>
        <v-flex class="xs9">
          <v-autocomplete id="search"
                          v-model="search_query"
                          :loading="is_suggestions_loading"
                          :items="results.entries"
                          :search-input.sync="aquery"
                          v-on:keyup.enter="search_event"
                          hide-details
                          prepend-icon="search"
                          label="Search"
                          single-line
                          :allow-overflow="false"
                          dense>
          </v-autocomplete>
        </v-flex>
      </v-layout>
    </div>
    <v-container>
      <v-card class="elevation-6">
        <v-card-title primary-title>
          <span class="headline">Results of search "{{ query }}" ({{ results.count }}):</span>
        </v-card-title>
        <divider/>
        <div v-if="is_loading">
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </div>
        <div v-else v-for="(result, index) in results.content" v-bind:key="result.name">
          <package-section v-bind:name="result.name" v-bind:version="result.version" v-bind:out_of_date="result.out_of_date" v-bind:description="result.description"
                           v-bind:maintainer="result.maintainer" v-bind:last_modified="result.last_modified" v-bind:votes="result.votes"
                           v-bind:popularity="result.popularity"></package-section>
          <divider v-if="index + 1 < results.count"/>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  import app from '../app';
  import aur from '../aur';
  import utils from '../utils';

  import Divider from '../components/divider.vue';
  import PackageSection from '../components/package_section.vue';

  function get_by_name_from_value(value) {
    switch (value) {
      case 'name-desc':
        return 'Name, Description';
      case 'name':
        return 'Name';
      case 'maintainer':
        return 'Maintainer';
      default:
        return undefined;
    }
  }

  export default {
    name: 'search',
    props: {
      query: {
        type: String,
        default: ''
      },
      by: {
        type: String,
        default: 'name-desc'
      },
      dark_theme: Boolean
    },
    components: {
      Divider,
      PackageSection
    },
    data() {
      return {
        is_loading: true,
        is_suggestions_loading: false,
        search_query: this.query,
        search_data: {
          query: this.query,
          by: {text: get_by_name_from_value(this.by), value: this.by},
        },
        aquery: null,
        search_by_items: [{text: 'Name, Description', value: 'name-desc'}, {text: 'Name only', value: 'name'}, {text: 'Maintainer', value: 'maintainer'}],
        results: {
          count: 0,
          entries: [],
          content: []
        },
        page: {
          title: 'Search'
        }
      }
    },
    watch: {
      aquery() {
        this.is_suggestions_loading = true;
        aur.search(this.aquery, this.by, results => {
          this.results.entries = results.map(r => r.name).sort();
          if (this.aquery != null && !this.results.entries.includes(this.aquery))
            this.results.entries.unshift(this.aquery);
          this.is_suggestions_loading = false;
        });
      },
      search_query(val) {
        this.search_data.query = val;
        this.search();
      }
    },
    methods: {
      update_results(content) {
        this.results.count = content.length;
        this.results.entries = content.map(r => r.name);
        if (this.aquery != null)
          this.results.entries.unshift(this.aquery);
        this.results.content = content;
      },
      update() {
        this.results.count = 0;
        this.is_loading = true;
        if (!app.is_search_valid(this.query, this.by)) {
          this.is_loading = false;
          this.results.count = 0;
          this.results.content = [];
          return;
        }
        aur.search(this.query, this.by, results => {
          this.update_results(results);
          this.is_loading = false;
        });
      },
      search_event() {
        this.search_query = this.aquery;
      },
      search() {
        this.$nextTick(function () {
          utils.search(this.search_query, this.search_data.by.value);
          this.$nextTick(this.update);
        });
      }
    },
    created() {
      this.is_loading = true;
      if (!app.is_search_valid(this.query, this.by)) {
        this.is_loading = false;
        this.results.count = 0;
        this.results.content = [];
        return;
      }
      this.aquery = this.query;
      aur.search(this.query, this.by, results => {
        this.update_results(results);
        this.is_loading = false;
      })
    },
    head: {
      title() {
        return {
          inner: 'AUR Browser',
          separator: '-',
          complement: this.page.title + ': ' + this.search_data.query
        };
      },
      meta() {
        return [
          {name: 'description', c: `Search results for query "${this.search_data.query}" by "${this.search_data.by.text}".`, id: 'desc'},
          {p: 'og:title', c: `AUR Browser - ${this.page.title}: ${this.search_data.query}`},
          {p: 'og:url', c: window.location.href},
          {p: 'og:description', c: `Search results for query "${this.search_data.query}" by "${this.search_data.by.text}".`}
        ]
      }
    }
  }
</script>

<style scoped>
  input {
    text-align: left !important;
  }
</style>
