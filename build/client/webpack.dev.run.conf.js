/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const WebpackBar = require('webpackbar');
const merge = require('webpack-merge');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const express = require('express');
const utils = require('../utils');
const loader = require('../utils/loader');
const plugin = require('../utils/plugin');
const config = require('../config');
const webpackBaseConfig = require('./webpack.base.conf');

const webpackConfig = merge(webpackBaseConfig, {
  mode: 'development',
  output: {
    publicPath: '/',
    filename: utils.formatDistributionAssetsPath('js/[name].js'),
    chunkFilename: utils.formatDistributionAssetsPath('js/[name].js'),
  },
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /./, to: path.posix.join('/', config.distributionIndex) },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: process.env.HOST || config.host,
    // port: process.env.PORT && Number(process.env.PORT) || config.port,
    open: config.autoOpenBrowser,
    useLocalIp: true,
    overlay: config.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: '/',
    proxy: config.proxy || {},
    quiet: true,
    watchOptions: {
      poll: config.poll,
      ignored: config.watchNodeModules
        ? []
        : ['node_modules/**'],
    },
    before: (app) => {
      app.use('/', express.static(utils.fullPath(config.staticDirectory)))
    }
  },
  module: {
    rules: [
      ...loader.styleLoaders({ extract: true }),
    ],
  },
  // cheap-module-eval-source-map is faster for localhost dev
  devtool: '#source-map',
  plugins: [
    new WebpackBar({
      name: 'Client-Dev',
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    // extract css into its own file
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: utils.formatDistributionAssetsPath('css/[name].css'),
    }),
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

module.exports = webpackConfig;
