/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
// see http://vuejs-templates.github.io/webpack for documentation.

exports.staticDirectory = 'static';
exports.distributionDirectory = 'dist';
exports.distributionIndex = 'index.html';
exports.distributionAssetsDirectory = '';

/**
 * Application base url path
 * Synchronous modify those files below if you want to make change:
 *   .vscode/launch.json
 */
exports.publicPath = process.env.PUBLIC_PATH;

/**
 * Local debug port
 */
exports.debugPort = 8080;

/**
 * Whether use ESLint
 */
exports.useESLint = true;

/**
 * Whether use StyleLint
 */
exports.useStyleLint = true;

// Run the build command with an extra argument to
// View the bundle analyzer report after build finishes:
// `npm run build:report`
exports.bundleAnalyzerReport = process.env.REPORT === 'Y';

// Build for chrome extension
// `npm run build --chrome-ext`
exports.chromeExt = process.env.CHROME_EXT === 'Y';

// Gzip off by default as many popular static hosts such as
// Surge or Netlify already gzip all static assets for you.
// Before setting to `true`, make sure to:
// npm install --save-dev compression-webpack-plugin
exports.productionGzip = false;
exports.productionGzipExtensions = ['js', 'css'];

// watch all node_modules
exports.watchNodeModules = process.env.WATCH_NODE_MODULES === 'Y';
