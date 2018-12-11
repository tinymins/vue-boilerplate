/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const utils = require('./utils');
const loader = require('./utils/loader');
const config = require('../config');
const webpackBaseConfig = require('./webpack.base.conf');

const webpackConfig = merge(webpackBaseConfig, {
  output: {
    filename: utils.assetsPath('js/[name].[hash].js'),
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [utils.fullPath('src'), utils.fullPath('test')],
        options: {
          configFile: '.eslintrc.js',
          // fix: true,
          cache: true,
          emitWarning: false,
          failOnError: true,
          formatter: eslintFriendlyFormatter,
        },
      },
      ...loader.styleLoaders({
        extract: false,
        sourceMap: config.sourceMap,
      }),
    ],
  },
  devtool: config.sourceMap
    ? '#source-map'
    : false,
  plugins: [
    new StylelintBarePlugin({
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
      cacheLocation: './node_modules/.stylelintcache',
      emitErrors: true,
      failOnError: true,
    }),
    new HtmlWebpackPlugin({
      filename: utils.fullPath('dist/index.html'),
      template: './src/index.html',
      inject: true,
      favicon: utils.fullPath('src/assets/favicon.ico'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
    }),
  ],
});

module.exports = webpackConfig;
