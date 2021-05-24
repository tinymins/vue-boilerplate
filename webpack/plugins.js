/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');

const stylelintPlugin = options => new StylelintBarePlugin(Object.assign({
  configFile: '.stylelintrc.js',
  files: [
    'src/**/*.vue',
    'src/**/*.css',
    'src/**/*.less',
    'src/**/*.sass',
    'src/**/*.scss',
    '!**/iconfont.css',
  ],
  // fix: true,
  cache: true,
  cacheLocation: './node_modules/.cache/.stylelintcache',
  emitErrors: false,
  failOnError: false,
}, options));

exports.stylelintPlugin = stylelintPlugin;
