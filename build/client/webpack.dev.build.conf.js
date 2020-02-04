/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const WebpackBar = require('webpackbar');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const utils = require('../utils');
const loader = require('../utils/loader');
const plugin = require('../utils/plugin');
const config = require('../config');
const webpackBaseConfig = require('./webpack.base.conf');

const webpackConfig = merge(webpackBaseConfig, {
  mode: 'development',
  output: {
    filename: utils.formatDistributionAssetsPath('js/[name].[hash:24].js'),
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      ...loader.styleLoaders({ extract: true }),
    ],
  },
  devtool: '#source-map',
  plugins: [
    new WebpackBar({
      name: 'Client-Dev',
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: utils.formatDistributionAssetsPath('css/[name].css'),
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: utils.fullPath(config.staticDirectory),
        to: utils.fullPath(config.distributionDirectory),
        ignore: ['.*'],
      },
    ]),
    // auto generate service worker
    new GenerateSW({
      cacheId: config.id,
      swDest: 'service-worker.js',
      dontCacheBustURLsMatching: /static\//,
      exclude: [/\.html$/, /\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: /\/(m\/static)/,
          handler: 'NetworkFirst',
        },
      ],
    }),
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
