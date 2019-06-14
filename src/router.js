/*
 * Copyright © 2019 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import Vue from 'vue';
import Router from 'vue-router';

import Index from './views/index';
import About from './views/about.vue';
import Changelog from './views/about/changelog';
import Contributing from './views/about/contributing';
import User from './views/user.vue';
import Package from './views/package.vue';
import Packages from './views/packages.vue';
import Search from './views/search';
import NotFound from './views/not_found.vue';

Vue.use(Router);

export const routes = [
  {
    path: '*',
    component: NotFound,
    meta: {
      link: false
    }
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Index,
    meta: {
      icon: 'home',
      link: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      icon: 'info',
      link: true
    }
  },
  {
    path: '/about/changelog',
    name: 'Changelog',
    component: Changelog,
    meta: {
      icon: 'archive',
      link: false
    }
  },
  {
    path: '/about/contributing',
    name: 'Contributing',
    component: Contributing,
    meta: {
      icon: '',
      link: false
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    props: (route) => ({query: route.query.q, by: route.query.by}),
    meta: {
      icon: 'search',
      link: true
    }
  },
  {
    path: '/user/:name',
    name: 'User page',
    component: User,
    meta: {
      icon: '',
      link: false
    }
  },
  {
    path: '/packages',
    name: 'Packages',
    component: Packages,
    props: (route) => ({index: Number(route.query.i)}),
    meta: {
      icon: 'apps',
      link: true
    }
  },
  {
    path: '/packages/:i',
    name: 'Packages_indexed',
    component: Packages,
    meta: {
      icon: 'apps',
      link: false
    }
  },
  {
    path: '/package/:pkg',
    name: 'package',
    component: Package,
    meta: {
      icon: 'apps',
      link: false
    }
  }
];

export default new Router({
  mode: 'history',
  routes
});
