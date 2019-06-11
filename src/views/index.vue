<template>
  <v-container>
    <v-layout id="index-banner">
      <v-flex>
        <h1 class="center blue-grey--text text--lighten-4 brand-title">AUR Browser</h1>
        <h5 class="center light white--text">A web AUR browser.</h5>
        <v-layout>
          <v-flex class="xs12 md10 offset-md1">
            <v-container>
              <v-text-field v-model="search_query" v-on:change="search" hide-details prepend-icon="search" label="Search" type="search"></v-text-field>
            </v-container>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <br/>
    <v-layout id="main_container">
      <v-flex class="xs12 md6 offset-md3">
        <v-card>
          <v-card-title>
            <div><span class="headline mb-0">Statistics</span></div>
          </v-card-title>
          <v-card-text>
            <div id="main_main_progress" v-if="!has_statistics_loaded">
              <v-progress-linear :indeterminate="true"></v-progress-linear>
            </div>
            <v-data-table :items="statistics" v-else hide-actions hide-headers>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.data }}</td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import aur from '../aur';
  import utils from '../utils';

  export default {
    name: "index",
    data: () => {
      return {
        has_statistics_loaded: false,
        search_query: '',
        statistics: '',
        page: {
          title: 'Home',
          description: 'Home page of AUR Browser.'
        }
      }
    },
    methods: {
      search: function () {
        this.$nextTick(function () {
          utils.search(this.search_query, 'name-desc');
          this.$nextTick(this.update_search);
        });
      }
    },
    created() {
      aur.get_statistics(stats => {
        this.has_statistics_loaded = true;
        this.statistics = utils.to_array(stats.querySelectorAll('tr')).map(stat => {
          return {name: stat.querySelector('td.stat-desc').innerText, data: stat.querySelectorAll('td')[1].innerText};
        });
      });
    },
    head: {
      title: {
        inner: 'AUR Browser',
        separator: ' ',
        complement: ' '
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