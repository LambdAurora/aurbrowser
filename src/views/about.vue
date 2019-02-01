<template>
  <div class="app-main">
    <div class="section no-pad-bot" id="index-banner">
      <div class="container">
        <br/>
        <br/>
        <h1 class="center blue-grey--text text--lighten-4">AUR Browser</h1>
        <div class="row center">
          <h5 class="xs12 light">A web AUR Browser. (Version {{ VERSION }})</h5>
          <h6 class="xs12 light">
            The original <a href="https://aur.archlinux.org/" class="orange-text text--accent-2">aurweb</a> isn't very beautiful, why not use one more attractive to the eyes?
          </h6>
        </div>
      </div>
    </div>

    <v-container class="body-1">
      <v-layout row wrap>
        <v-flex class="xs12 md6">
          <div class="icon-block center">
            <h2 class="center orange--text text--accent-2"><i class="fas fa-code"></i></h2>
            <h5 class="center white-text">Open source</h5>

            <p class="light white-text"><span class="brand-title">AUR Browser</span> is MIT licensed.</p>
            <p class="light white-text">You can find the code on <a href="https://github.com/LambdAurora/aurbrowser.git" class="orange-text text--accent-2">GitHub</a>!</p>
          </div>
        </v-flex>

        <v-flex class="xs12 md6">
          <div class="icon-block center">
            <h2 class="center orange--text text--accent-2"><i class="fas fa-archive"></i></h2>
            <h5 class="center white--text">Packages</h5>

            <p class="light white--text">Browse every packages available on AUR, search, see the comments leaved by the users and see the PKGBUILD.</p>
          </div>
        </v-flex>
      </v-layout>

      <h5 class="center white--text title">Technologies and libraries</h5>
      <br/>

      <v-layout row wrap>
        <v-flex class="xs12 md4">
          <div class="icon-block center">
            <h2 class="center orange--text text--accent-2"><i class="fab fa-js"></i></h2>
            <h5 class="center white--text">JavaScript & PWA</h5>

            <p class="light white--text">
              <span class="brand-title">AUR Browser</span> is built with modern JavaScript technologies. It's also a Progressive Web App: you can add it to your home screen on your
              mobile phone!
            </p>
          </div>
        </v-flex>

        <v-flex class="xs12 md4">
          <div class="icon-block center">
            <h2 class="center orange--text text--accent-2"><img height="45" src="https://vuejs.org/images/logo.png" alt="Vue logo"></h2>
            <h5 class="center white--text"><a href="https://vuejs.org/" target="_blank">Vue</a></h5>

            <p class="light white--text">
              <span class="brand-title">AUR Browser</span> uses the Vue framework to manage all the views as a single page application with <a
                    href="https://github.com/vuejs/vue-router.git" target="_blank">vue-router</a>.
            </p>
          </div>
        </v-flex>

        <v-flex class="xs12 md4">
          <div class="icon-block center">
            <h2 class="center orange--text text--accent-2"><img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="vuetify" style="height: 45px"/></h2>
            <h5 class="center white--text"><a href="https://vuetifyjs.com/" target="_blank">Vuetify</a></h5>

            <p class="light white--text">
              To bring you Material design, <span class="brand-title">AUR Browser</span> uses Vuetify a Material Design Component Framework for Vue.
            </p>
          </div>
        </v-flex>
      </v-layout>

      <h5 class="center white--text title">Contributors and contributing</h5>
      <br/>

      <v-layout row wrap>
        <v-flex class="xs12 md4">
          <div class="icon-block center">
            <h2 class="center orange--text text--accent-2"><img src="https://avatars3.githubusercontent.com/u/12587332?s=460&v=4" class="responsive-img circle"
                                                                alt="LambdAurora's avatar"/></h2>
            <h5 class="center white--text"><a href="https://github.com/LambdAurora" target="_blank" class="orange-text text--accent-2">LambdAurora</a></h5>

            <p class="light white--text">Created the project, that's all.</p>
          </div>
        </v-flex>

        <v-flex class="xs12 md4">
          <div class="icon-block center">
            <h2 class="center orange--text text--accent-2"><img src="https://avatars2.githubusercontent.com/u/4016501?s=460&v=4" class="responsive-img circle"
                                                                alt="unixfox's avatar"/></h2>
            <h5 class="center white--text"><a href="https://github.com/unixfox" target="_blank" class="orange--text text--accent-2">unixfox</a></h5>

            <a href="https://camo.githubusercontent.com/2c453bd2d87adb3c8864b93cd57731eb0989a6e8/68747470733a2f2f692e726564642e69742f31366269636c747630383832312e706e67"
               class="light white--text">Made a pull request.</a>
            <p class="light white--text">More seriously he helped me to get the domain name because I am a bit dumb.</p>
          </div>
        </v-flex>

        <v-flex class="xs12 md4">
          <div class="icon-block">
            <h2 class="center orange--text text--accent-2"><i class="fas fa-hands-helping"></i></h2>
            <h5 class="center white--text">Contribute</h5>

            <p class="light white--text">
              Wants to contribute? Go ahead on <a href="https://github.com/LambdAurora/aurbrowser.git" target="_blank" class="orange--text text--accent-2">GitHub</a>, we don't
              bite!
            </p>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
	import CONSTANTS from "../constants";

	export default {
		name: "about",
		data()
		{
			return {
				VERSION: CONSTANTS.VERSION
			}
		}
	}
</script>

<style scoped>
  .icon-block img.responsive-img {
    max-width: 45px;
  }
</style>