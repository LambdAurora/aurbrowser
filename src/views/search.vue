<template>
  <div>
    <div class="row">
      <v-layout class="grey lighten-2 elevation-2" row wrap style="padding: 0 .75rem .5rem;">
        <v-flex class="xs3">
          <v-combobox v-model="search_by" v-on:input="search" type="button" :items="search_by_items" label="Search by:" hide-details light></v-combobox>
        </v-flex>
        <v-flex class="xs9">
          <v-text-field v-model="search_query" v-on:change="search" hide-details prepend-icon="search" label="Search" single-line light></v-text-field>
        </v-flex>
      </v-layout>
    </div>
    <v-container>
      <v-card class="grey darken-1">
        <v-card-title class="white-text" primary-title>
          <span class="headline">Results of search "{{ query }}" ({{ results_count }}):</span>
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
  </div>
</template>

<script>
	import app from '../app';
	import aur from '../aur';
	import utils from '../utils';

	import Divider from '../components/divider.vue';
	import PackageSection from '../components/package_section.vue';

	function get_by_name_from_value(value)
	{
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
		name: "search",
		props: {
			query: {
				type: String,
			},
			by: {
				type: String,
				default: 'name-desc'
			}
		},
		data()
		{
			return {
				loading: true,
				search_query: this.query,
				search_by: {text: get_by_name_from_value(this.by), value: this.by},
				last_update: '',
				results_count: 0,
				results: [],
				search_by_items: [{text: 'Name, Description', value: 'name-desc'}, {text: 'Name only', value: 'name'}, {text: 'Maintainer', value: 'maintainer'}]
			}
		},
		components: {
			Divider,
			PackageSection
		},
		methods: {
			update_search: function () {
				this.loading = true;
				if (!app.is_search_valid(this.query, this.by)) {
					this.loading = false;
					this.results_count = 0;
					this.results = [];
					return;
				}
				aur.search(this.query, this.by, results => {
					this.results_count = results.length;
					this.results = results;
					this.loading = false;
				});
			},
			search: function () {
				this.$nextTick(function () {
					if (this.last_update === this.search_query)
						return;
					this.last_update = this.search_query;
					utils.search(this.search_query, this.search_by.value);
					this.$nextTick(this.update_search);
				});
			}
		},
		created()
		{
			this.update_search();
		}
	}
</script>

<style scoped>
  input {
    text-align: left !important;
  }
</style>