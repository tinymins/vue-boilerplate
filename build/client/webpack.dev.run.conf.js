/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const merge = require('webpack-merge');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const utils = require('../utils');
const loader = require('../utils/loader');
const plugin = require('../utils/plugin');
const config = require('../config');
const webpackBaseConfig = require('./webpack.base.conf');

const webpackConfig = merge(webpackBaseConfig, {
  mode: 'development',
  output: {
    filename: utils.formatDistributionAssetsPath('js/[name].[hash].js'),
  },
  module: {
    rules: [
      ...loader.styleLoaders(true),
    ],
  },
  // cheap-module-eval-source-map is faster for localhost dev
  devtool: '#source-map',
  plugins: [
    // extract css into its own file
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: utils.formatDistributionAssetsPath('css/[name].css'),
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    // Friendly-errors-webpack-plugin recognizes certain classes of
    // webpack errors and cleans, aggregates and prioritizes them
    // to provide a better Developer Experience.
    // https://github.com/geowarin/friendly-errors-webpack-plugin#readme
    new FriendlyErrorsPlugin(),
  ],
});

if (config.useESLint) {
  webpackConfig.module.rules.push(
    ...loader.eslintLoaders({
      cache: true,
      emitWarning: true,
      failOnError: false,
    }),
  );
}

if (config.useStyleLint) {
  webpackConfig.plugins.push(
    plugin.stylelintPlugin({
      failOnError: false,
    }),
  );
}

// add hot-reload related code to entry chunks
Object.keys(webpackConfig.entry).forEach((name) => {
  webpackConfig.entry[name] = [
    'eventsource-polyfill',
    './build/utils/webpack-hot-middleware-client',
  ].concat(webpackConfig.entry[name]);
});

module.exports = webpackConfig;
