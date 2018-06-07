// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path');
const moment = require('moment');
const { appPath } = require('./environment.js');

const isRun = process.env.NODE_ACTION === 'run';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  env: {
    NODE_ENV: process.env.NODE_ENV,
    NODE_ACTION: process.env.NODE_ACTION,
    BUILD_TIME: moment().format('YMMDDHHmm'),
  },
  port: 8081,
  autoOpenBrowser: true,
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'static',
  assetsPublicPath: appPath,
  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report,
  // Gzip off by default as many popular static hosts such as
  // Surge or Netlify already gzip all static assets for you.
  // Before setting to `true`, make sure to:
  // npm install --save-dev compression-webpack-plugin
  productionGzip: false,
  productionGzipExtensions: ['js', 'css'],
  proxyTable: {},
  // CSS Sourcemaps off by default because relative paths are "buggy"
  // with this option, according to the CSS-Loader README
  // (https://github.com/webpack/css-loader#sourcemaps)
  // In our experience, they generally work as expected,
  // just be aware of this issue when enabling this option.
  sourceMap: !isProd,
  // see https://www.npmjs.com/package/px2rem
  px2rem: { remUnit: 75 },
};
