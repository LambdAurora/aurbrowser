/*
 * Copyright © 2019 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import {VERSION} from './constants';
import Vue from 'vue';
import './plugins/vuetify';
import VueHead from 'vue-head';
import router from './router';
import utils from './utils';

import App from './app.vue';

import './sw_register'

function is_by_filter_valid(by_filter) {
  return by_filter === 'name' || by_filter === 'name-desc' || by_filter === 'maintainer';
}

export default {
  VERSION: VERSION,
  is_search_valid(query, by_filter) {
    return query !== undefined && query.length !== 0 && is_by_filter_valid(by_filter);
  },
  launch() {
    Vue.use(VueHead);
    utils.init(router);

    Vue.prototype.$dark_mode = true;
    Vue.prototype.$change_theme = function (theme) {
      this.$dark_mode = theme;
    };

    new Vue({
      render: h => h(App),
      router
    }).$mount('#app');
  }
}
