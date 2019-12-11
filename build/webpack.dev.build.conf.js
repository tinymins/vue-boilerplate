/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const utils = require('./utils');
const loader = require('./utils/loader');
const plugin = require('./utils/plugin');
const config = require('../config');
const webpackBaseConfig = require('./webpack.base.conf');

const webpackConfig = merge(webpackBaseConfig, {
  mode: 'development',
  output: {
    filename: utils.assetsPath('js/[name].[hash:24].js'),
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      ...loader.eslintLoaders({
        cache: true,
        emitWarning: true,
        failOnError: false,
      }),
      ...loader.styleLoaders(true),
    ],
  },
  devtool: '#source-map',
  plugins: [
    plugin.stylelintPlugin({
      failOnError: false,
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[chunkhash].css',
    }),
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

module.exports = webpackConfig;
