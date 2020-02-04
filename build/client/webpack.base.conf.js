/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const utils = require('../utils');
const config = require('../config');
const webpackBaseConfig = require('../webpack.base');

const webpackConfig = merge(webpackBaseConfig, {
  entry: config.clientEntry,
  output: {
    path: utils.fullPath(config.distributionDirectory),
    publicPath: process.env.PUBLIC_PATH,
    filename: utils.formatDistributionAssetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.formatDistributionAssetsPath('js/[name].[chunkhash].js'),
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime', // webpack runtime
    },
    // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/113
    // 无解
    splitChunks: {
      // chunks: 'initial', // initial all async
      cacheGroups: {
        styles: {
          test: m => m.constructor.name === 'CssModule',
          name: 'commons',
          minChunks: 2,
          chunks: 'all',
          reuseExistingChunk: true,
          // enforce: true,
        },
        vue: {
          filename: utils.formatDistributionAssetsPath('js/vue-family-bundle.js'),
          name: 'vue-family-bundle',
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex|vuex-router-sync)[\\/]/,
          chunks: 'initial',
        },
        route: {
          filename: utils.formatDistributionAssetsPath('js/route.[hash:24].js'),
          name: 'route',
          test: /[\\/]src[\\/](router)[\\/]/,
          chunks: 'initial',
        },
        store: {
          filename: utils.formatDistributionAssetsPath('js/store.[hash:24].js'),
          name: 'store',
          test: /[\\/]src[\\/](store)[\\/]/,
          chunks: 'initial',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /moment[\\/]locale$/,
      /^\.\/(zh-cn)$/,
    ),
    // keep module.id stable when vendor modules does not change
    new webpack.NamedChunksPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: config.title,
      filename: config.distributionIndex,
      template: utils.fullPath('template/index.html'),
      // favicon: utils.fullPath('src/assets/favicon.ico'),
      inject: true,
      publicPath: process.env.PUBLIC_PATH,
    }),
  ],
});

module.exports = webpackConfig;
