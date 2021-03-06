<template>
  <v-app :dark="dark_mode" v-bind:class="{'page_background': !dark_mode, 'page_background_dark': dark_mode}">
    <v-toolbar dark app>
      <v-toolbar-side-icon id="toolbar_side_icon" aria-label="Menu" @click.stop="sidenav = !sidenav" class="ls-hide-on-large-and-up"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-md-center" style="display: flex; align-items: center;">
        <img src="/aurbrowser_white_64.png" alt="aurbrowser logo" height="32" width="32" style="margin-right: 0.5em;"/>
        <router-link to="/home">AUR Browser</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="ls-hide-on-med-and-down">
        <v-btn flat to="/home">
          <v-icon left>home</v-icon>
          Home
        </v-btn>
        <v-menu open-on-hover offset-y>
          <template v-slot:activator="{ on }">
            <v-btn flat to="/about" v-on="on">
              <v-icon left>info</v-icon>
              About
            </v-btn>
          </template>
          <v-list dark>
            <v-list-tile to="/about/changelog">
              <v-list-tile-action>
                <v-icon>archive</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>Changelog</v-list-tile-content>
            </v-list-tile>
            <v-list-tile to="/about/contributing">
              <v-list-tile-action>
                <v-icon>fa-hands-helping</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>Contributing</v-list-tile-content>
            </v-list-tile>
            <v-list-tile href="https://github.com/LambdAurora/aurbrowser" target="_blank" rel="noopener noreferrer nofollow">
              <v-list-tile-action>
                <i class="v-icon fab fa-github"></i>
              </v-list-tile-action>
              <v-list-tile-content>GitHub</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn icon to="/search">
          <v-icon>search</v-icon>
        </v-btn>
        <v-btn flat to="/packages">
          <v-icon left>apps</v-icon>
          Packages
        </v-btn>
        <v-btn icon @click="dark_mode = !dark_mode;">
          <v-icon v-if="dark_mode" style="line-height: 24px; height: 24px;">brightness_3</v-icon>
          <v-icon v-else style="line-height: 24px; height: 24px;">brightness_5</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view :dark_theme="dark_mode"/>
    </v-content>

    <v-footer dark height="auto">
      <v-card flat tile class="flex" style="background: #212329 !important;">
        <v-card-title>
          <v-container>
            <h5 class="subheading">
              Made with <i class="fas fa-heart red--text text--darken-1"></i> on <a href="https://github.com/LambdAurora/aurbrowser" rel="noopener noreferrer nofollow">GitHub</a>
            </h5>
          </v-container>
        </v-card-title>
        <v-card-actions>
          v{{ VERSION }}
          <v-spacer></v-spacer>
          <a href="https://github.com/LambdAurora/aurbrowser/blob/master/LICENSE" rel="noopener noreferrer nofollow" class="grey--text text--lighten-1 right">MIT License</a>
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
        <divider/>
        <v-list-tile to="/about/changelog">
          <v-list-tile-action>
            <v-icon>archive</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Changelog</v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/about/contributing">
          <v-list-tile-action>
            <v-icon>fa-hands-helping</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Contributing</v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="https://github.com/LambdAurora/aurbrowser" target="_blank" rel="noopener noreferrer nofollow">
          <v-list-tile-action>
            <i class="v-icon fab fa-github"></i>
          </v-list-tile-action>
          <v-list-tile-content>GitHub</v-list-tile-content>
        </v-list-tile>
        <divider/>
        <v-list-tile>
          <v-list-tile-action>
            <v-tooltip bottom>
              <v-switch v-model="dark_mode" color="primary" label="Dark mode"></v-switch>
              <span v-if="dark_mode">Switch to light mode.</span>
              <span v-else>Switch to dark mode.</span>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
  import app from './app';
  import Divider from './components/divider';

  export default {
    name: 'App',
    components: {
      Divider
    },
    data() {
      return {
        VERSION: app.VERSION,
        dark_mode: this.$dark_mode,
        sidenav: false
      }
    },
    mounted() {
      if (localStorage.dark_mode) {
        this.$change_theme(localStorage.dark_mode === 'true');
        this.dark_mode = this.$dark_mode;
      }
    },
    watch: {
      dark_mode(val) {
        localStorage.dark_mode = val;
        this.$change_theme(val);
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
