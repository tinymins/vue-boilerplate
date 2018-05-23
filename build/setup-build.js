/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-07 09:20:59
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2017-11-24 11:16:42
 */
/* eslint-disable no-console */
if (!process.env.NODE_ENV) {
  console.log('Empty NODE_ENV is not allowed!\n');
  process.exit(1);
}
process.env.NODE_ACTION = 'build';

const utils = require('./utils');
const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.base.conf')();

utils.checkVersions();
console.log(chalk.cyan(`Start building for ${process.env.NODE_ENV} version.\n`));

const spinner = ora(`Building for ${process.env.NODE_ENV} ...`);
spinner.start();

rm(path.join(config.assetsRoot, config.assetsSubDirectory), (err) => {
  if (err) throw err;
  webpack(webpackConfig, (e, stats) => {
    spinner.stop();
    if (e) throw e;
    process.stdout.write(`${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}\n\n`);

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n',
    ));
    if (process.env.NODE_ENV === 'development') process.exit(0);
  });
});
