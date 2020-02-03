/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');
const moment = require('moment');
const argv = require('yargs').argv;
const config = require('../../webpack.config.js');

const isRun = process.env.NODE_ACTION === 'run';
const isProd = process.env.NODE_ENV === 'production';
const fullPath = s => path.join(__dirname, '..', '..', s);

const defaultConfig = {
  id: 'vue-boilerplate',
  title: 'Vue Boilerplate',
  env: {
    NODE_ENV: process.env.NODE_ENV,
    NODE_ACTION: process.env.NODE_ACTION,
    ROUTER_MODE: process.env.ROUTER_MODE,
    PUBLIC_PATH: process.env.PUBLIC_PATH,
    BUILD_TIME: moment().format('YMMDDHHmm'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': fullPath('src'),
      ':': fullPath('static'),
    },
    modules: [
      fullPath('src'),
      'node_modules',
    ],
  },
  // Define HTTP proxies to your custom API backend
  // https://github.com/chimurai/http-proxy-middleware
  proxy: {},
  host: '0.0.0.0',
  port: 8081,
  autoOpenBrowser: true,
  manifestPath: 'manifest.json',
  staticDirectory: 'static',
  distributionDirectory: 'dist',
  distributionAssetsDirectory: '',
  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: argv.report,
  // Gzip off by default as many popular static hosts such as
  // Surge or Netlify already gzip all static assets for you.
  // Before setting to `true`, make sure to:
  // npm install --save-dev compression-webpack-plugin
  productionGzip: false,
  productionGzipExtensions: ['js', 'css'],
  // CSS Sourcemaps off by default because relative paths are "buggy"
  // with this option, according to the CSS-Loader README
  // (https://github.com/webpack/css-loader#sourcemaps)
  // In our experience, they generally work as expected,
  // just be aware of this issue when enabling this option.
  sourceMap: !isProd,
};

module.exports = Object.assign(defaultConfig, config);
