/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import * as IS from 'io-ts';

export * from 'io-ts';
export { PathReporter } from 'io-ts/PathReporter';
export { default as PrettyReporter } from 'io-ts-reporters';

export const undefinable = <T extends IS.Mixed>(mixed: T) => IS.union([
  mixed,
  IS.undefined,
]);
export type Undefinable<T> = T | undefined;

export const nullable = <T extends IS.Mixed>(mixed: T) => IS.union([
  mixed,
  IS.null,
]);
export type Nullable<T> = T | null;

export const optional = <T extends IS.Mixed>(mixed: T) => IS.union([
  mixed,
  IS.undefined,
  IS.null,
]);
export type Optional<T> = Undefinable<Nullable<T>>;
