/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ts = require('typescript');
const utils = require('../utils');
const loader = require('../utils/loader');
const config = require('../config');

console.log(`Typescript Version: ${ts.version}`);

// HTML plugin
// #1669 html-webpack-plugin's default sort uses toposort which cannot
// handle cyclic deps in certain cases. Monkey patch it to handle the case
// before we can upgrade to its 4.0 version (incompatible with preload atm)
const chunkSorters = require('html-webpack-plugin/lib/chunksorter');
const depSort = chunkSorters.dependency;
chunkSorters.auto = chunkSorters.dependency = (chunks, ...args) => {
  try {
    return depSort(chunks, ...args)
  } catch (e) {
    // fallback to a manual sort if that happens...
    return chunks.sort((a, b) => {
      // make sure user entry is loaded last so user CSS can override
      // vendor CSS
      if (a.id === 'app') {
        return 1
      } else if (b.id === 'app') {
        return -1
      } else if (a.entry !== b.entry) {
        return b.entry ? -1 : 1
      }
      return 0
    })
  }
}

const webpackConfig = {
  entry: {
    app: './src/main.ts',
  },
  stats: {
    // https://webpack.js.org/configuration/stats/
    entrypoints: false,
    children: false,
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
  resolve: {
    extensions: ['.js', '.ts', '.d.ts', '.tsx', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': utils.fullPath('src'),
      ':': utils.fullPath('static'),
    },
    modules: [
      utils.fullPath('src'),
      'node_modules',
    ],
  },
  module: {
    rules: [
      ...loader.vueLoaders(),
      ...loader.scriptLoaders(),
      ...loader.staticLoaders(),
    ],
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new VueLoaderPlugin(),
    new WebpackBar(),
    new webpack.ContextReplacementPlugin(
      /moment[\\/]locale$/,
      /^\.\/(zh-cn)$/,
    ),
    new webpack.EnvironmentPlugin(config.env),
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
};

module.exports = webpackConfig;
