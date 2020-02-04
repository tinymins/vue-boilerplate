/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const WebpackBar = require('webpackbar');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const utils = require('../utils');
const config = require('../config');
const webpackBuildConfig = require('./webpack.prod.build.conf');

const webpackConfig = merge(webpackBuildConfig, {
  entry: config.chromeExtEntry,
  plugins: [
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: utils.fullPath(config.manifestPath),
        to: './',
        ignore: ['.*'],
      },
    ]),
  ],
});

webpackConfig.plugins.unshift(
  new WebpackBar({
    name: 'Chrome-Ext',
    color: '#ab71f3',
  }),
);

module.exports = webpackConfig;
