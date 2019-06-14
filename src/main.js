/*
 * Copyright © 2019 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import '@babel/polyfill';
import './plugins/vuetify';

import 'vuetify/dist/vuetify.min.css'
import 'prismjs/themes/prism-okaidia.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'npm-font-open-sans/open-sans.css'

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import app from './app';

app.launch();
