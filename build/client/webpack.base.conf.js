/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const ts = require('typescript');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const utils = require('../utils');
const config = require('../config');
const webpackBaseConfig = require('../webpack.base');

const webpackConfig = merge(webpackBaseConfig, {
  entry: {
    app: './src/main.ts',
  },
  output: {
    path: config.assetsRoot,
    publicPath: config.assetsPublicPath,
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
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
          filename: utils.assetsPath('js/vue-family-bundle.js'),
          name: 'vue-family-bundle',
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex|vuex-router-sync)[\\/]/,
          chunks: 'initial',
        },
        route: {
          filename: utils.assetsPath('js/route.[hash:24].js'),
          name: 'route',
          test: /[\\/]src[\\/](router)[\\/]/,
          chunks: 'initial',
        },
        store: {
          filename: utils.assetsPath('js/store.[hash:24].js'),
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
    new WebpackBar(),
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
      filename: 'index.html',
      template: './index.html',
      inject: true,
      favicon: utils.fullPath('src/assets/favicon.ico'),
    }),
  ],
});

module.exports = webpackConfig;
