/*
 * Copyright © 2018 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import aurbrowser_package from '../package';

function is_by_filter_valid(by_filter)
{
	return by_filter === 'name' || by_filter === 'name-desc' || by_filter === 'maintainer';
}

export default {
	VERSION: aurbrowser_package.version,
	is_search_valid: (query, by_filter) => {
		return query !== undefined && query.length !== 0 && is_by_filter_valid(by_filter);
	}
}