/*
 * Copyright © 2019 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

const AUR_BASE_URL = 'https://aur.archlinux.org';

export default {
  VERSION: '1.2.0',
  AUR_BASE_URL: AUR_BASE_URL,
  AUR_RPC_URL: `${AUR_BASE_URL}/rpc/?v=5`,
  CORS_PROXY: 'https://cors.aurbrowser.tk/'
};
