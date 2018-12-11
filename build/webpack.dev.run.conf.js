/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
          emitWarning: true,
          failOnError: false,
          formatter: eslintFriendlyFormatter,
        },
      },
      ...loader.styleLoaders({
        extract: false,
        sourceMap: config.sourceMap,
      }),
    ],
  },
  // cheap-module-eval-source-map is faster for localhost dev
  devtool: config.sourceMap
    ? '#cheap-module-eval-source-map'
    : false,
  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: true,
      favicon: utils.fullPath('src/assets/favicon.ico'),
    }),
  ],
});

// add hot-reload related code to entry chunks
Object.keys(webpackConfig.entry).forEach((name) => {
  webpackConfig.entry[name] = [
    'eventsource-polyfill',
    './build/utils/webpack-hot-middleware-client',
  ].concat(webpackConfig.entry[name]);
});

module.exports = webpackConfig;
