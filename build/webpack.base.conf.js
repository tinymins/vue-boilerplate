/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const PostCompilePlugin = require('webpack-post-compile-plugin');
const TransformModulesPlugin = require('webpack-transform-modules-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const utils = require('./utils');
const loader = require('./utils/loader');
const config = require('../config');

const webpackConfig = {
  entry: {
    app: './src/index.js',
  },
  output: {
    path: config.assetsRoot,
    publicPath: config.assetsPublicPath,
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': utils.fullPath('src'),
      ':': utils.fullPath('static'),
    },
    modules: [
      utils.fullPath('src'),
      utils.fullPath('node_modules'),
    ],
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      ...loader.vueLoaders(),
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [utils.fullPath('src'), utils.fullPath('test')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
    ],
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new VueLoaderPlugin(),
    new WebpackBar(),
    new PostCompilePlugin(),
    new TransformModulesPlugin(),
    new webpack.ContextReplacementPlugin(
      /moment[\\/]locale$/,
      /^\.\/(zh-cn)$/,
    ),
    new webpack.DefinePlugin({
      'process.env': (() => {
        const env = {};
        Object.keys(config.env).forEach((k) => {
          env[k] = JSON.stringify(config.env[k]);
        });
        return env;
      })(),
    }),
    new FriendlyErrorsPlugin(),
  ],
};

module.exports = webpackConfig;
