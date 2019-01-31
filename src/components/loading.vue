<template>
  <div class="preloader-wrapper big active">
    <div class="spinner-layer spinner-blue-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div>
      <div class="gap-patch">
        <div class="circle"></div>
      </div>
      <div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
</template>

<script>
	export default {
		name: "loading"
	}
</script>

<style scoped>
  .preloader-wrapper {
    position: absolute;
    top: calc(50vh - 32px);
    left: calc(50% - 32px);
  }
</style>