/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint-disable no-console */
process.env.NODE_ENV = 'production'
process.env.NODE_ACTION = 'build';

const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const utils = require('./utils');
const config = require('../config');
const webpackConfig = require('./webpack.prod.build.conf');

utils.checkVersions();
console.log(chalk.cyan(`Start building for ${process.env.NODE_ENV} version.\n`));

const spinner = ora(`Building for ${process.env.NODE_ENV} ...`);
spinner.start();

Promise.all([
  utils.rm(path.join(config.assetsRoot, 'index.html')),
  utils.rm(path.join(config.assetsRoot, 'report.html')),
  utils.rm(path.join(config.assetsRoot, config.assetsSubDirectory)),
]).then(() => {
  webpack(webpackConfig, (e, stats) => {
    spinner.stop();
    if (e) {
      throw e;
    }
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
    // if (process.env.NODE_ENV === 'development') process.exit(0);
  });
}).catch((err) => {
  spinner.stop();
  throw err;
});
