<template>
  <v-app dark style="background: #262A32 !important;">
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="sidenav = !sidenav" class="ls-hide-on-large-and-up"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-md-center">
        <router-link to="/home">AUR Browser</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="ls-hide-on-med-and-down">
        <v-btn flat to="/home">
          <v-icon left>home</v-icon>
          Home
        </v-btn>
        <v-btn icon to="/search">
          <v-icon>search</v-icon>
        </v-btn>
        <v-btn flat to="/about">
          <v-icon left>info</v-icon>
          About
        </v-btn>
        <v-btn flat to="/packages">
          <v-icon left>apps</v-icon>
          Packages
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <v-footer height="auto">
      <v-card flat tile class="flex" style="background: #212329 !important;">
        <v-card-title>
          <v-container>
            <h5 class="subheading">Made with <i class="fas fa-heart red--text text--darken-1"></i> on <a href="https://github.com/LambdAurora/aurbrowser">GitHub</a></h5>
          </v-container>
        </v-card-title>
        <v-card-actions>
          v{{ VERSION }}
          <v-spacer></v-spacer>
          <a href="https://github.com/LambdAurora/aurbrowser/blob/master/LICENSE" class="grey--text text--darken-1 right">MIT License</a>
        </v-card-actions>
      </v-card>
    </v-footer>

    <v-navigation-drawer app width="250" temporary v-model="sidenav" v-if="$vuetify.breakpoint.mdAndDown">
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
    data() {
      return {
        VERSION: app.VERSION,
        sidenav: false
      }
    },
    computed: {
      routes() {
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
