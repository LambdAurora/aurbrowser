<template>
  <v-container>
    <v-card color="grey darken-1" elevation="3" :flat="$vuetify.breakpoint.xsOnly">
      <v-card-title primary-title>
        <div class="headline" v-if="result_details === 404">
          <span class="red--text">Package '{{ $route.params.pkg }}' was not found.</span>
        </div>
        <div class="headline" v-else-if="pkg != null">
          <a :href="CONSTANTS.AUR_BASE_URL + '/packages/' + $route.params.pkg + '/'" class="orange-text text-accent-2">{{ $route.params.pkg }}</a>
          v<span :class="{ 'red--text': pkg.out_of_date }">{{ pkg.version }}</span>
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
          <li class="collection-item grey darken-2">Clone URL (Git): <a :href="get_clone_url()" class="orange-text text-accent-2">{{ get_clone_url() }}</a> (Read only)
          </li>
          <li class="divider"></li>
          <template v-if="pkg.out_of_date">
            <li class="collection-item-alert grey darken-2">
              <v-alert :value="true" type="error">Flagged out-of-date ({{ utils.convert_timestamp(pkg.out_of_date) }})</v-alert>
            </li>
            <li class="divider"></li>
          </template>
          <li class="collection-item grey darken-2">Description: {{ pkg.description }}</li>
          <li class="divider"></li>
          <li class="collection-item grey darken-2">
            Link:
            <a :href="pkg.link.url">
              <span v-if="pkg.link.icon != null" :class="'fab fa-' + pkg.link.icon + ' aperlambda-foreground-' + pkg.link.foreground"></span>
              {{ pkg.link.url }}
            </a>
          </li>
          <li class="divider"></li>
          <template v-if="pkg.keywords.length > 0">
            <li class="collection-item grey darken-2">
              Keywords:
              <template v-for="keyword in pkg.keywords">
                <v-chip v-bind:key="keyword" color="primary" label class="flags-chip">{{ keyword }}</v-chip>
              </template>
            </li>
            <li class="divider"></li>
          </template>
          <template v-if="pkg.license !== undefined">
            <li class="collection-item grey darken-2">Licenses: {{ pkg.license.join(',') }}</li>
            <li class="divider"></li>
          </template>
          <template v-if="pkg.conflicts">
            <li class="collection-item grey darken-2">
              Conflicts:
              <span v-html="pkg.conflicts.map(conflict => `<a href='/package/${conflict}'>${conflict}</a>`).join(', ')"></span>
            </li>
            <li class="divider"></li>
          </template>
          <li class="collection-item grey darken-2">Submitter: <a :href="'/account/' + pkg.submitter">{{ pkg.submitter }}</a></li>
          <li class="divider"></li>
          <li class="collection-item grey darken-2">
            Maintainer:
            <span v-if="pkg.orphan || pkg.maintainer[0] === 'None'" class="red--text">None</span>
            <template v-else>
              <a v-if="pkg.maintainer.length === 1" :href="'/account/' + pkg.maintainer[0]">{{ pkg.maintainer[0] }}</a>
              <template v-else v-for="(person, index) in pkg.maintainer"><span v-if="index !== 0" v-bind:key="index">, </span><a :href="'/account/' + person" v-bind:key="person">{{
                person }}</a>
              </template>
            </template>
          </li>
          <li class="divider"></li>
          <li class="collection-item grey darken-2">Last packager: <a :href="'/account/' + pkg.last_packager">{{ pkg.last_packager }}</a></li>
          <li class="divider"></li>
          <li class="collection-item grey darken-2">Votes: {{ pkg.votes }}</li>
          <li class="divider"></li>
          <li class="collection-item grey darken-2">Popularity: {{ pkg.popularity }}</li>
          <li class="divider"></li>
          <li class="collection-item grey darken-2">First submitted: {{ pkg.first_submitted }}</li>
          <li class="divider"></li>
          <li class="collection-item grey darken-2">Last updated: {{ pkg.last_modified }}</li>
        </ul>

        <v-layout row>
          <v-flex class="xs12 md6 pkg-details-section">
            <h6 class="pkg-details-header grey darken-2">Dependencies ({{ pkg.dependencies.count }})</h6>
            <ul>
              <li v-for="item in pkg.dependencies.items" v-bind:key="item" v-html="item"></li>
            </ul>
          </v-flex>
          <v-flex class="xs12 md6 pkg-details-section">
            <h6 class="pkg-details-header grey darken-2">Required by ({{ pkg.required_by.count }})</h6>
            <ul>
              <li v-for="item in pkg.required_by.items" v-bind:key="item" v-html="item"></li>
            </ul>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex class="xs12 pkg-details-section">
            <h6 class="pkg-details-header grey darken-2">Sources ({{ pkg.files.count }})</h6>
            <ul>
              <li v-for="item in pkg.files.items" v-bind:key="item" v-html="item"></li>
            </ul>
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-card-actions v-if="pkg != null">
        <v-btn flat color="primary" @click="pkgbuild_display = true">View PKGBUILD</v-btn>
        <v-btn flat color="primary" :href="`${CONSTANTS.AUR_BASE_URL}/cgit/aur.git/snapshot/${pkg.name}.tar.gz`">Download a snapshot</v-btn>
        <v-btn flat color="primary" :href="`https://wiki.archlinux.org/index.php/Special:Search?search=${pkg.name}`">Search wiki</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="pkgbuild_display">
      <v-card>
        <v-card-title v-if="pkgbuild" class="headline">PKGBUILD of {{ pkg.name }}:</v-card-title>
        <v-card-text><pre v-if="pkgbuild" class="line-numbers"><code class="language-bash grey darken-4" v-html="pkgbuild_content"></code></pre></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="pkgbuild_display = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
	import CONSTANTS from "../constants";
	import aur from '../aur';
	import utils from '../utils';
	import Prism from 'prismjs';

	export default {
		name: 'package',
		data()
		{
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
			get_clone_url: function () {
				return CONSTANTS.AUR_BASE_URL + '/' + this.$route.params.pkg + '.git';
			}
		},
		created()
		{
			aur.get_package(this.$route.params.pkg, result => {
				this.pkg = result;
				utils.fetch_raw(aur.build_url('package_pkgbuild', {package: result.name}), true, pkgbuild_doc => {
					console.log(pkgbuild_doc);
					this.pkgbuild = true;
					this.pkgbuild_content = Prism.highlight(pkgbuild_doc.replaceAll('<', '\u003C').replaceAll('>', '\u003E'), Prism.languages.bash);
				});
			}, err_status => {
				this.result_details = err_status;
			});
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