/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');
const utils = require('./utils');

const eslintPlugin = options => new ESLintPlugin(Object.assign({
  overrideConfigFile: '.eslintrc.js',
  files: [
    'src/**/*.js',
    'src/**/*.ts',
    'src/**/*.jsx',
    'src/**/*.tsx',
    'src/**/*.json',
  ],
  // fix: true,
  cache: false,
  // emitWarning: false,
  // emitError: false,
  failOnWarning: false,
  failOnError: false,
  formatter: require('eslint-formatter-pretty'),
}, options));

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

exports.eslintPlugin = eslintPlugin;
exports.stylelintPlugin = stylelintPlugin;
