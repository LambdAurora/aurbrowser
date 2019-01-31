<template>
  <div class="container">
    <div class="card grey darken-1">
      <div class="card-content white-text">
        <span class="card-title">
          <a :href="CONSTANTS.AUR_BASE_URL + '/packages/' + $route.params.pkg + '/'" class="orange-text text-accent-2">{{ $route.params.pkg }}</a>
          v<span :class="{ 'red-text': pkg.out_of_date != null }">{{ pkg.version }}</span>
        </span>
        <ul class="collection">
          <li class="collection-item white-text grey darken-2">Clone URL (Git): <a :href="get_clone_url()" class="orange-text text-accent-2">{{ get_clone_url() }}</a> (Read only)</li>
          <li class="collection-item white-text grey darken-2">Description: {{ pkg.description }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
	import CONSTANTS from "../constants";
	import aur from '../aur';

	export default {
		name: 'package',
		data()
		{
			return {
				CONSTANTS: CONSTANTS,
				pkg: {}
			}
		},
		methods: {
			get_clone_url: function () {
				return CONSTANTS.AUR_BASE_URL + '/' + this.$route.params.pkg + '.git';
			}
		},
		created()
		{
			aur.get_package(this.$route.params.pkg, result => {
				console.log(result);
				this.pkg = result;
			});
		}
	}
</script>

<style scoped>
</style>