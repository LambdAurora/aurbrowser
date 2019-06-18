<template>
  <v-container>
    <v-card class="ls-card" elevation="3" :flat="$vuetify.breakpoint.xsOnly">
      <v-card-title primary-title>
        <div class="headline" v-if="result_details === 404">
          <span class="red--text">Package '{{ $route.params.pkg }}' was not found.</span>
        </div>
        <div class="headline" v-else-if="pkg != null">
          <a :href="CONSTANTS.AUR_BASE_URL + '/packages/' + $route.params.pkg + '/'" class="orange-text text-accent-2">{{ $route.params.pkg }}</a>
          v<span :class="{ 'red--text': pkg.out_of_date, 'text--darken-1': pkg.out_of_date }">{{ pkg.version }}</span>
        </div>
        <span v-else class="headline">Loading...</span>
      </v-card-title>
      <v-card-text v-if="result_details === 404">
        <h6>
          Maybe you can find the package in
          <a :href="`https://www.archlinux.org/packages/?sort=&q=${$route.params.pkg}&maintainer=&flagged=`">the official ArchLinux repositories?</a>
        </h6>
      </v-card-text>
      <v-card-text v-else-if="pkg != null">
        <ul class="collection">
          <collection-item :dark="dark_theme">
            Clone URL (Git): <a :href="get_clone_url()" class="orange-text text-accent-2">{{ get_clone_url() }}</a> (Read only)
          </collection-item>
          <li class="ls-divider"></li>
          <template v-if="pkg.out_of_date">
            <li class="collection-item-alert">
              <v-alert :value="true" type="error">Flagged out-of-date ({{ utils.convert_timestamp(pkg.out_of_date) }})</v-alert>
            </li>
            <li class="ls-divider"></li>
          </template>
          <collection-item :dark="dark_theme">Description: {{ pkg.description }}</collection-item>
          <li class="ls-divider"></li>
          <collection-item :dark="dark_theme">
            Link:
            <a :href="pkg.link.url">
              <span v-if="pkg.link.icon != null" :class="'fab fa-' + pkg.link.icon" :style="'color: ' + pkg.link.foreground"></span>
              {{ pkg.link.url }}
            </a>
          </collection-item>
          <li class="ls-divider"></li>
          <template v-if="pkg.keywords.length > 0">
            <collection-item :dark="dark_theme">
              Keywords:
              <template v-for="keyword in pkg.keywords">
                <v-chip v-bind:key="keyword" color="primary" label class="flags-chip">{{ keyword }}</v-chip>
              </template>
            </collection-item>
            <li class="ls-divider"></li>
          </template>
          <template v-if="pkg.license !== undefined">
            <collection-item :dark="dark_theme">Licenses: {{ pkg.license.join(',') }}</collection-item>
            <li class="ls-divider"></li>
          </template>
          <template v-if="pkg.conflicts">
            <collection-item :dark="dark_theme">
              Conflicts:
              <span v-html="pkg.conflicts.map(conflict => `<a href='/package/${conflict}'>${conflict}</a>`).join(', ')"></span>
            </collection-item>
            <li class="ls-divider"></li>
          </template>
          <collection-item :dark="dark_theme">Submitter:
            <router-link :to="'/user/' + pkg.submitter">{{ pkg.submitter }}</router-link>
          </collection-item>
          <li class="ls-divider"></li>
          <collection-item :dark="dark_theme">
            Maintainer:
            <span v-if="pkg.orphan || pkg.maintainer[0] === 'None'" class="red--text">None</span>
            <template v-else>
              <router-link v-if="pkg.maintainer.length === 1" :to="'/user/' + pkg.maintainer[0]">{{ pkg.maintainer[0] }}</router-link>
              <template v-else v-for="(person, index) in pkg.maintainer">
                <span v-if="index !== 0" v-bind:key="index">, </span>
                <router-link :to="'/user/' + person" v-bind:key="person">{{ person }}</router-link>
              </template>
            </template>
          </collection-item>
          <li class="ls-divider"></li>
          <collection-item :dark="dark_theme">Last packager:
            <router-link :to="'/user/' + pkg.last_packager">{{ pkg.last_packager }}</router-link>
          </collection-item>
          <li class="ls-divider"></li>
          <collection-item :dark="dark_theme">Votes: {{ pkg.votes }}</collection-item>
          <li class="ls-divider"></li>
          <collection-item :dark="dark_theme">Popularity: {{ pkg.popularity }}</collection-item>
          <li class="ls-divider"></li>
          <collection-item :dark="dark_theme">First submitted: {{ pkg.first_submitted }}</collection-item>
          <li class="ls-divider"></li>
          <collection-item :dark="dark_theme">Last updated: {{ pkg.last_modified }}</collection-item>
        </ul>

        <v-layout row>
          <v-flex class="xs12 md6 pkg-details-section">
            <h6 class="pkg-details-header grey darken-2 white--text">Dependencies ({{ pkg.dependencies.count }})</h6>
            <ul>
              <li v-for="item in pkg.dependencies.items" v-bind:key="item" v-html="item"></li>
            </ul>
          </v-flex>
          <v-flex class="xs12 md6 pkg-details-section">
            <h6 class="pkg-details-header grey darken-2 white--text">Required by ({{ pkg.required_by.count }})</h6>
            <ul>
              <li v-for="item in pkg.required_by.items" v-bind:key="item" v-html="item"></li>
            </ul>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex class="xs12 pkg-details-section">
            <h6 class="pkg-details-header grey darken-2 white--text">Sources ({{ pkg.files.count }})</h6>
            <ul>
              <li v-for="item in pkg.files.items" v-bind:key="item" v-html="item"></li>
            </ul>
          </v-flex>
        </v-layout>
      </v-card-text>

      <div class="ls-card-actions" v-if="pkg != null">
        <v-btn flat color="primary" @click="pkgbuild_display = true">View PKGBUILD</v-btn>
        <v-btn flat color="primary" :href="`${CONSTANTS.AUR_BASE_URL}/cgit/aur.git/snapshot/${pkg.name}.tar.gz`">Download a snapshot</v-btn>
        <v-btn flat color="primary" :href="`https://wiki.archlinux.org/index.php/Special:Search?search=${pkg.name}`">Search wiki</v-btn>
      </div>
    </v-card>

    <v-layout row>
      <v-flex style="margin-top: 1em;" v-if="pkg != null && pkg.comments.pinned.length !== 0">
        <v-card id="pinned_comments" class="ls-card">
          <v-card-title primary-title class="grey darken-2 white--text" style="padding: 12px;">
            <h5 style="margin: 0;"><i class="fas fa-thumbtack"></i> Pinned comments</h5>
          </v-card-title>
          <div v-for="(comment, index) in pkg.comments.pinned" v-bind:key="index">
            <div :id="comment.author + '_' + index" class="section" style="display: flex; flex-wrap: wrap; flex-direction: column; margin: 0 0.25em 0 0.25em;"
                 :key="comment.author + comment.header">
              <h6>
                <router-link :to="'/user/' + comment.author">{{ comment.author }}</router-link>
                {{ comment.header }}
              </h6>
              <p style="margin: 0.25em 0 0.25em 0.25em;" v-html="comment.content"></p>
            </div>
            <divider :key="comment.header" v-if="index !== pkg.comments.pinned.length - 1"/>
          </div>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex style="margin-top: 1em;" v-if="pkg != null && pkg.comments.comments.length !== 0">
        <v-card id="comments" class="ls-card">
          <v-card-title primary-title class="grey darken-2 white--text" style="padding: 12px;">
            <h5 style="margin: 0;"><i class="fas fa-comment"></i> Comments</h5>
          </v-card-title>
          <div v-for="(comment, index) in pkg.comments.comments" v-bind:key="index">
            <div class="section" style="display: flex; flex-wrap: wrap; flex-direction: column; margin: 0 0.25em 0 0.25em;" :key="comment.author + comment.header">
              <h6>
                <router-link :to="'/user/' + comment.author">{{ comment.author }}</router-link>
                {{ comment.header }}
              </h6>
              <p style="margin: 0.25em 0 0.25em 0.25em;" v-html="comment.content"></p>
            </div>
            <divider :key="comment.header" v-if="index !== pkg.comments.comments.length - 1"/>
          </div>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="pkgbuild_display">
      <v-card>
        <v-card-title v-if="pkgbuild" class="headline">PKGBUILD of {{ pkg.name }}:</v-card-title>
        <v-card-text>
          <pre v-if="pkgbuild" class="line-numbers"><code class="language-bash grey darken-4" v-html="pkgbuild_content"></code></pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="pkgbuild_display = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import CONSTANTS from '../constants';
  import aur from '../aur';
  import utils from '../utils';
  import Prism from 'prismjs';

  import Divider from '../components/divider.vue';
  import CollectionItem from '../components/collection_item.vue';

  export default {
    name: 'package',
    components: {
      Divider,
      CollectionItem
    },
    props: {
      dark_theme: Boolean
    },
    data() {
      return {
        CONSTANTS: CONSTANTS,
        utils: utils,
        pkgbuild: false,
        pkgbuild_display: false,
        pkgbuild_content: '',
        pkg: null,
        result_details: null
      }
    },
    methods: {
      get_clone_url() {
        return CONSTANTS.AUR_BASE_URL + '/' + this.$route.params.pkg + '.git';
      }
    },
    created() {
      aur.get_package(this.$route.params.pkg, result => {
        this.pkg = result;
        utils.fetch_raw(aur.build_url('package_pkgbuild', {package: result.name}), true, pkgbuild_doc => {
          this.pkgbuild = true;
          this.pkgbuild_content = Prism.highlight(pkgbuild_doc.replaceAll('<', '\u003C').replaceAll('>', '\u003E'), Prism.languages.bash);
        });
      }, err_status => {
        this.result_details = err_status;
      });
    },
    head: {
      title() {
        return {
          inner: 'AUR Browser',
          separator: '-',
          complement: this.$route.params.pkg
        };
      },
      meta() {
        return [
          {name: 'description', c: `See package ${this.$route.params.pkg} on AUR Browser.`, id: 'desc'},
          {p: 'og:title', c: `AUR Browser - ${this.$route.params.pkg}`},
          {p: 'og:url', c: window.location.href},
          {p: 'og:description', c: `See package ${this.$route.params.pkg} on AUR Browser.`}
        ]
      }
    }
  }
</script>

<style scoped>
  .collection {
    margin: .5rem 0 1rem 0;
    border: 1px solid #e0e0e0;
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  .collection-item {
    line-height: 1.5rem;
    padding: 10px 20px;
    margin: 0;
  }

  .collection-item-alert {
    line-height: 1.5rem;
    margin: 0;
  }

  .flags-chip {
    font-size: 0.8rem;
    line-height: 22px;
    height: 22px;
    margin: 0 4px;
  }

  .v-alert {
    margin: 0;
  }

  code {
    box-shadow: 0 0 0 0;
    width: 100%
  }

  .pkg-details-section {
    margin: 0.2em 0.35em;
  }

  .pkg-details-header {
    padding: 0.2em 0.35em;
  }
</style>
