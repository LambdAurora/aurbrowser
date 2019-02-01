<template>
  <div class="section no-pad-bot" id="index-banner">
    <div class="container">
      <br />
      <br />
      <h1 class="header center blue-grey-text text-lighten-4 display-4">404 not found!</h1>
      <div class="row center">
        <h5 id="error_details" class="header col s12 light white-text display-2">Sorry but you are not on the good page. :c</h5>
      </div>
      <div class="row center">
        <v-btn href="/" class="pulse" color="primary">Main page</v-btn>
        <!--<a href="/" class="btn-large waves-effect waves-light orange pulse">Main page</a>-->
      </div>
    </div>
  </div>
</template>

<script>
	export default {
		name: "not_found.vue"
	}
</script>

<style scoped>

</style>
