<template>
  <div class="section white-text">
    <h5><a :href="'/package/' +  name">{{ name }}</a> v<span v-bind:class="{ 'red-text': out_of_date }">{{ version }}</span></h5>
    <p style="padding-left: 5px">{{ description }}</p>
    <div class="row">
      <div v-if="last_modified" class="col s6">
        From: <a :href="'/account/' + maintainer">{{ maintainer }}</a> • {{ last_modified }}
      </div>
      <div v-else class="col s6">
        From: <a :href="'/account/' + maintainer">{{ maintainer }}</a>
      </div>
      <div class="col s6">
        <span class="right">Votes: {{ votes }} • Popularity: {{ popularity }}</span>
      </div>
    </div>
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
  }

  .row {
    margin-bottom: auto;
  }

  a
  {
    color: #ffab40;
  }
</style>