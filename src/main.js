/*
 * Copyright © 2018 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

/*import Vue from 'vue';
import './plugins/vuetify'

import App from './app.vue';

new Vue({
	render: h => h(App)
}).$mount('#app');*/

import "@babel/polyfill";
import Vue from 'vue';
import './plugins/vuetify';

import 'vuetify/dist/vuetify.min.css'

import "roboto-fontface/css/roboto/roboto-fontface.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import App from './app.vue';
import router from './router';
import utils from './utils';

utils.init(router);

new Vue({
	render: h => h(App),
	router
}).$mount('#app');