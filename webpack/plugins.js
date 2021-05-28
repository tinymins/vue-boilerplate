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
  configFile: utils.fullPath('.stylelintrc.js'),
  files: [
    'src/**/*.vue',
    'src/**/*.css',
    'src/**/*.less',
    'src/**/*.sass',
    'src/**/*.scss',
    '!**/iconfont.css',
  ],
  ignorePath: utils.fullPath('.stylelintignore'),
  // fix: true,
  cache: true,
  cacheLocation: utils.fullPath('./node_modules/.cache/.stylelintcache'),
  // emitWarning: false,
  // emitError: false,
  failOnWarning: false,
  failOnError: false,
  formatter: require('stylelint-formatter-pretty'),
}, options));

exports.eslintPlugin = eslintPlugin;
exports.stylelintPlugin = stylelintPlugin;
