<template>
  <v-app dark class="lambdacolors_background">
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="sidenav = !sidenav" class="hide-on-large-and-up">
        <v-icon>menu</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="headline text-md-center">
        <a href="/">AUR Browser</a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hide-on-med-and-down">
        <v-btn flat href="/">
          <v-icon left>home</v-icon>
          Home
        </v-btn>
        <v-btn icon href="/search">
          <v-icon>search</v-icon>
        </v-btn>
        <v-btn flat href="/about">
          <v-icon left>info</v-icon>
          About
        </v-btn>
        <v-btn flat href="/packages">
          <v-icon left>apps</v-icon>
          Packages
        </v-btn>
      </v-toolbar-items>
      <!--<ul class="right hide-on-med-and-down">
        <li>
          <a href="/">
            <i class="material-icons left">home</i>
            Home
          </a>
        </li>
        <li>
          <a href="/search"><i class="material-icons">search</i></a>
        </li>
        <li>
          <a href="/about">
            <i class="material-icons left">info</i>
            About
          </a>
        </li>
        <li>
          <a href="/packages">
            <i class="material-icons left">apps</i>
            Packages
          </a>
        </li>
      </ul>-->
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <v-footer height="auto">
      <v-card flat tile class="flex lambdacolors_appbar">
        <v-card-title>
          <v-container>
            <h5 class="subheading">Made with <i class="fas fa-heart red--text text--darken-1"></i> on <a href="https://github.com/LambdAurora/aurbrowser.git/">GitHub</a></h5>
          </v-container>
        </v-card-title>
        <v-card-actions class="lambdacolors_copyright_notice">
          v{{ VERSION }}
          <v-spacer></v-spacer>
          <a href="https://github.com/LambdAurora/aurbrowser/blob/master/LICENSE" class="grey--text text--darken-1 right">MIT License</a>
        </v-card-actions>
      </v-card>
    </v-footer>

    <v-navigation-drawer app width="250" absolute temporary v-model="sidenav" v-if="$vuetify.breakpoint.mdAndDown">
      <v-list>
        <v-subheader>AUR Browser</v-subheader>
        <v-list-tile v-for="(route, i) in routes" :key="i" :to="route">
          <v-list-tile-action>
            <v-icon v-html="route.meta.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ route.name }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
	import app from './app';

	export default {
		name: 'App',
		data()
		{
			return {
				VERSION: app.VERSION,
				sidenav: false
			}
		},
		computed: {
			routes()
			{
				return this.$router.options.routes.filter(({meta: {link} = {}}) => link);
			}
		}
	}
</script>

<style scoped>
  .lambdacolors_copyright_notice {
    background-color: rgba(51, 51, 51, 0.08);
  }

  i.material-icons {
    height: 64px;
    line-height: 64px;
    display: block;
    font-size: 24px;
  }
</style>
