/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  'plugins': {
    // to edit target browsers: use "browserslist" field in package.json
    'postcss-import': {},
    'postcss-preset-env': {},
    'autoprefixer': {},
    // see https://www.npmjs.com/package/postcss-px2rem
    'postcss-px2rem': {
      remUnit: 75,
    },
    // 'postcss-px-to-viewport': {
    //   'viewportWidth': 750,
    //   'viewportHeight': 1334,
    //   'unitPrecision': 5,
    //   'viewportUnit': 'vw',
    //   'selectorBlackList': [],
    //   'minPixelValue': 1,
    //   'mediaQuery': false,
    // },
  },
};
