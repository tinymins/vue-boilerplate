/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SWPrecachePlugin = require('sw-precache-webpack-plugin');
const utils = require('./utils');
const loader = require('./utils/loader');
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
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[chunkhash].css',
    }),
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'haiman-vue2',
      filename: 'service-worker.js',
      minify: false,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.html$/, /\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: /\/(m\/static)/,
          handler: 'networkFirst',
        },
      ],
    }),
  ],
});

module.exports = webpackConfig;
