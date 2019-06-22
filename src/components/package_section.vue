<template>
  <div class="section">
    <v-layout row>
      <v-flex class="votes">
        <v-btn icon>
          <v-icon>
            keyboard_arrow_up
          </v-icon>
        </v-btn>
        <div>
        {{ votes }}
        </div>
        <v-btn icon disabled>
          <v-icon>
            keyboard_arrow_down
          </v-icon>
        </v-btn>
      </v-flex>
      <v-flex>
        <v-layout column>
          <v-flex>
            <div class="package_title">
                <h4>
                  <router-link :to="'package/' +  name">{{ name }}</router-link>
                </h4>
                <h5 class="ls-hide-on-small-only" style="margin-top: 1.52rem;">v<span v-bind:class="{ 'red--text': out_of_date, 'text--darken-1': out_of_date }">{{ version }}</span></h5>
            </div>
          </v-flex>
          <v-flex>
            <h6 class="ls-hide-on-med-and-up">v<span v-bind:class="{ 'red--text': out_of_date, 'text--darken-1': out_of_date }">{{ version }}</span></h6>
          </v-flex>
          <v-flex>
            <span style="font-size: 0.90rem;" v-if="last_modified">
              From:
              <router-link :to="'/user/' + maintainer">{{ maintainer }}</router-link>
              • {{ last_modified }}
            </span>
            <span style="font-size: 0.90rem;" v-else>
              From:
              <router-link :to="'/user/' + maintainer">{{ maintainer }}</router-link>
            </span>
          </v-flex>
          <v-flex>
            <p style="font-size: 1.2rem;">{{ description }}</p>
          </v-flex>
          <v-flex>
            <p class="right">Popularity: {{ popularity }}</p>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
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
    padding-bottom: 1rem;
    margin-right: 1em;
  }

  .votes {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 5%;
  }

  @media only screen and (max-width: 600px) {
    .votes {
      max-width: 15%;
    }
  }

  .package_title {
    display: flex;
    align-items: baseline;
  }

  .package_title h5 {
    margin-left: 5px;
  }

  a {
    color: #ffab40;
  }
</style>
