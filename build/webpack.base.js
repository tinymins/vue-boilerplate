/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const ts = require('typescript');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const loader = require('./utils/loader');
const config = require('./config');

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
  stats: {
    // https://webpack.js.org/configuration/stats/
    entrypoints: false,
    children: false,
  },
  resolve: config.resolve,
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
    new webpack.EnvironmentPlugin(config.env),
  ],
};

module.exports = webpackConfig;
