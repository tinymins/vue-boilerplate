/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import * as IS from 'io-ts';

export * from 'io-ts';

export const undefinable = <T extends IS.Mixed>(mixed: T) => IS.union([
  mixed,
  IS.undefined,
]);

export const nullable = <T extends IS.Mixed>(mixed: T) => IS.union([
  mixed,
  IS.null,
]);

export const optional = <T extends IS.Mixed>(mixed: T) => undefinable(nullable(mixed));
