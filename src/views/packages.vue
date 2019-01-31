<template>
  <div>
    <v-layout class="grey lighten-2 elevation-2" row wrap style="padding: 0 .75rem .5rem;">
      <v-flex class="xs3">
        <v-combobox v-model="search_by" v-on:input="search" type="button" :items="search_by_items" label="Search by:" hide-details light></v-combobox>
      </v-flex>
      <v-flex class="xs9">
        <v-text-field v-model="search_query" v-on:change="search" hide-details prepend-icon="search" label="Search" single-line light></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout class="grey lighten-1 elevation-3" row wrap>
      <v-flex class="xs12 center">
        <v-pagination v-model="page" v-on:input="update" :length="total_pages()" :total-visible="7"></v-pagination>
      </v-flex>
    </v-layout>
    <v-container>
      <v-card class="grey darken-1">
        <v-card-title class="white-text" primary-title>
          <span class="headline">Packages ({{ total_packages }}):</span>
        </v-card-title>
        <divider />
        <div v-if="loading">
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </div>
        <div v-else v-for="result in results" v-bind:key="result.name">
          <package-section v-bind:name="result.name" v-bind:version="result.version" v-bind:out_of_date="result.out_of_date" v-bind:description="result.description"
                           v-bind:maintainer="result.maintainer" v-bind:last_modified="result.last_modified" v-bind:votes="result.votes"
                           v-bind:popularity="result.popularity"></package-section>
          <divider />
        </div>
      </v-card>
    </v-container>
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
		data()
		{
			return {
				loading: true,
				page: this.index / 50 + 1,
				search_by: {text: 'Name, Description', value: 'name-desc'},
				search_query: '',
				search_by_items: [{text: 'Name, Description', value: 'name-desc'}, {text: 'Name only', value: 'name'}, {text: 'Maintainer', value: 'maintainer'}],
				total_packages: '...',
				results_count: 0,
				results: []
			}
		},
		components: {
			Divider,
			PackageSection
		},
		methods: {
			update: function () {
				this.loading = true;
				this.$nextTick(function () {
					let index = (this.page - 1) * 50;
					this.$router.push(`/packages?i=${index}`);
					aur.get_packages(index, (results, count) => {
						this.total_packages = count;
						this.results_count = results.length;
						this.results = results;
						this.loading = false;
					});
        });
      },
			total_pages: function () {
				let rest = this.total_packages % 50;
				return (this.total_packages - rest) / 50;
			},
			search: function () {
				this.$nextTick(function () {
					utils.search(this.search_query, this.search_by.value);
					this.$nextTick(this.update_search);
				});
			}
		},
		created()
		{
			console.log(`Getting packages list (index: ${this.index})...`);
			aur.get_packages(this.index, (results, count) => {
				this.total_packages = count;
				this.results_count = results.length;
				this.results = results;
				this.loading = false;
			});
		}
	}
</script>

<style scoped>

</style>