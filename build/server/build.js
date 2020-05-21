/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
process.env.VUE_SSR = true;

const webpack = require('webpack');
const chalk = require('chalk');
const style = require('ansi-styles');
const webpackClientConf = require('./webpack.client.conf');
const webpackServerConf = require('./webpack.server.conf');
const utils = require('../utils');
const config = require('../config');
const rm = require('rimraf')

rm(utils.fullPath(config.distributionDirectory), e => {
  const compiler = webpack([webpackClientConf, webpackServerConf], (err, multiStats) => {
    if (err) throw err;
    multiStats.stats.forEach((stats, index) => {
      process.stdout.write(`${stats.toString({
        colors: {
          green: index === 0 ? style.color.ansi256.rgb(171, 113, 243) : style.color.ansi256.rgb(255, 165, 0),
        },
        modules: false,
        children: false, // if you are using ts-loader, setting this to true will make typescript errors show up during build
        chunks: false,
        chunkModules: false,
        entrypoints: false,
      })}\n\n`);
    });
    if (multiStats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }
    console.log(chalk.green('  Build complete.\n'));
  });
})
