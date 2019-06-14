<template>
  <div>
    <v-layout class="grey lighten-2 elevation-2" row wrap style="padding: 0 .75rem .5rem;">
      <v-flex class="xs3">
        <v-combobox v-model="search_by" v-on:input="search" type="button" :items="search_by_items" label="Search by:" hide-details light></v-combobox>
      </v-flex>
      <v-flex class="xs9">
        <v-autocomplete id="search"
                        v-model="search_query"
                        :loading="is_loading"
                        :items="search_entries"
                        :search-input.sync="search_content"
                        @change="search"
                        v-on:keyup.enter="search_event"
                        hide-details
                        prepend-icon="search"
                        label="Search"
                        single-line
                        light
                        dense>
        </v-autocomplete>
      </v-flex>
    </v-layout>
    <v-layout class="grey lighten-1 elevation-3" row wrap>
      <v-flex class="xs12 center">
        <v-pagination v-model="page_index" v-on:input="update" :length="total_pages()" :total-visible="5"></v-pagination>
      </v-flex>
    </v-layout>
    <v-container>
      <v-card class="grey darken-1">
        <v-card-title class="white-text" primary-title>
          <span class="headline">Packages ({{ total_packages }}):</span>
        </v-card-title>
        <divider/>
        <div v-if="loading">
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </div>
        <div v-else v-for="result in results" v-bind:key="result.name">
          <package-section v-bind:name="result.name" v-bind:version="result.version" v-bind:out_of_date="result.out_of_date" v-bind:description="result.description"
                           v-bind:maintainer="result.maintainer" v-bind:last_modified="result.last_modified" v-bind:votes="result.votes"
                           v-bind:popularity="result.popularity"></package-section>
          <divider/>
        </div>
      </v-card>
    </v-container>
    <v-layout class="grey lighten-1 elevation-3" row wrap>
      <v-flex class="xs12 center">
        <v-pagination v-model="page_index" v-on:input="update" :length="total_pages()" :total-visible="5"></v-pagination>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import aur from '../aur';
  import utils from '../utils';

  import Divider from '../components/divider.vue';
  import PackageSection from '../components/package_section.vue';

  export default {
    name: "packages",
    props: {
      index: {
        type: Number,
        default: 0
      }
    },
    components: {
      Divider,
      PackageSection
    },
    data() {
      return {
        loading: true,
        page_index: this.index / 50 + 1,
        search_by: {text: 'Name, Description', value: 'name-desc'},
        search_query: '',
        search_content: '',
        search_entries: [],
        is_loading: false,
        search_by_items: [{text: 'Name, Description', value: 'name-desc'}, {text: 'Name only', value: 'name'}, {text: 'Maintainer', value: 'maintainer'}],
        total_packages: '...',
        results_count: 0,
        results: [],
        page: {
          title: 'Packages',
          description: 'List of every packages available in the AUR.'
        }
      }
    },
    watch: {
      search_content(val) {
        if (val == null) return;
        this.is_loading = true;
        aur.search(val, this.search_by.value, results => {
          this.search_entries = results.map(r => r.name).sort();
          if (val != null && !this.search_entries.includes(val))
            this.search_entries.unshift(val);
          this.is_loading = false;
        });
      }
    },
    methods: {
      update() {
        this.loading = true;
        this.$nextTick(function () {
          let index = (this.page_index - 1) * 50;
          this.$router.push(`/packages?i=${index}`);
          aur.get_packages(index, (results, count) => {
            this.total_packages = count;
            this.results_count = results.length;
            this.results = results;
            this.loading = false;
          });
        });
      },
      total_pages() {
        let rest = this.total_packages % 50;
        return (this.total_packages - rest) / 50;
      },
      search_event() {
        this.search_query = this.search_content;
        this.search();
      },
      search() {
        this.$nextTick(function () {
          utils.search(this.search_query, this.search_by.value);
        });
      }
    },
    created() {
      console.log(`Getting packages list (index: ${this.index})...`);
      aur.get_packages(this.index, (results, count) => {
        this.total_packages = count;
        this.results_count = results.length;
        this.results = results;
        this.loading = false;
      });
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
