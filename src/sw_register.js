/*
 * Copyright © 2019 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import { register } from "register-service-worker";

register('/sw.js', {
  ready() {
    console.log('App is being served from cache by a service worker.');
  },
  cached() {
    console.log('Content has been cached for offline use.');
  }
});
