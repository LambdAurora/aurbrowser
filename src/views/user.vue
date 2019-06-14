<template>
  <v-container>
    <v-card color="ls-card grey darken-2" elevation="3" :flat="$vuetify.breakpoint.xsOnly">
      <v-card-title primary-title>
        <a :href="CONSTANTS.AUR_BASE_URL + '/account/' + $route.params.name + '/'" class="headline orange-text text-accent-2">{{ $route.params.name }}</a>
      </v-card-title>
      <v-card-text>
        <p>See the profile of {{ $route.params.name }} on AUR.</p>
        <br/>
        <p>We cannot display more information about the user because you must connected on AUR and go to the AUR page.</p>
      </v-card-text>
      <div class="ls-card-actions">
        <v-btn flat color="primary" :href="aur.build_url('account', {user: $route.params.name})">View on AUR</v-btn>
        <v-btn flat color="primary" :to="`/search?q=${$route.params.name}&by=maintainer`">Search submitted packages</v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script>
  import CONSTANTS from '../constants';
  import aur from '../aur';

  import Divider from '../components/divider.vue';

  export default {
    name: 'user',
    data() {
      return {
        CONSTANTS: CONSTANTS,
        aur: aur
      }
    },
    components: {
      Divider,
    },
    head: {
      title() {
        return {
          inner: 'AUR Browser',
          separator: '-',
          complement: this.$route.params.name
        };
      },
      meta() {
        return [
          {name: 'description', c: `See user ${this.$route.params.name} on AUR.`, id: 'desc'},
          {p: 'og:title', c: `AUR Browser - ${this.$route.params.name}`},
          {p: 'og:url', c: aur.build_url('account', this.$route.params.name)},
          {p: 'og:description', c: `See user ${this.$route.params.name} on AUR.`}
        ]
      }
    }
  }
</script>

<style scoped>
</style>
