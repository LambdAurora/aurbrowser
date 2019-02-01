<template>
  <div class="section white--text">
    <h5><a :href="'/package/' +  name">{{ name }}</a> v<span v-bind:class="{ 'red--text': out_of_date }">{{ version }}</span></h5>
    <p style="padding-left: 5px; padding-right: 5px;">{{ description }}</p>
    <v-layout row wrap style="margin-bottom: auto;">
      <v-flex v-if="last_modified" class="xs6">
        From: <a :href="'/account/' + maintainer">{{ maintainer }}</a> • {{ last_modified }}
      </v-flex>
      <v-flex v-else class="xs6">
        From: <a :href="'/account/' + maintainer">{{ maintainer }}</a>
      </v-flex>
      <v-flex class="xs6" style="padding-right: .75rem;">
        <span class="right">Votes: {{ votes }} • Popularity: {{ popularity }}</span>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
	export default {
		name: "package_section",
		props: {
			name: String,
			version: String,
			out_of_date: Boolean,
			description: String,
			maintainer: String,
			last_modified: String,
			votes: Number,
			popularity: Number
		},
	}
</script>

<style scoped>
  .section {
    padding-left: 5px;
    padding-bottom: 1rem;
  }

  a
  {
    color: #ffab40;
  }
</style>