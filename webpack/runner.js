/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

/**
 * Check params
 */
const ACTION_LIST = ['run', 'build'];
const ENV_LIST = ['development', 'production'];

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const nodeAction = argv.action;
const nodeEnv = argv.env || { run: 'development', build: 'production' }[nodeAction];
const report = argv.report;
const chromeExt = argv.chromeExt;
const publicPath = argv.publicPath;
const routerMode = argv.routerMode;
const watchNodeModules = argv['watch-node-modules'];

if (!ACTION_LIST.includes(nodeAction)) {
  console.error(`Invalid NODE_ACTION: ${nodeAction}, NODE_ACTION should be in ${ACTION_LIST.join(', ')}.`);
  return;
}
if (!ENV_LIST.includes(nodeEnv)) {
  console.error(`Invalid NODE_ENV: ${nodeEnv}, NODE_ENV should be in ${ENV_LIST.join(', ')}.`);
  return;
}

process.env.NODE_ACTION = nodeAction;
process.env.NODE_ENV = nodeEnv;
process.env.REPORT = report ? 'Y' : 'N';
process.env.CHROME_EXT = chromeExt ? 'Y' : 'N';
process.env.WATCH_NODE_MODULES = watchNodeModules ? 'Y' : 'N';
process.env.PUBLIC_PATH = publicPath || '/';
process.env.ROUTER_MODE = routerMode || (chromeExt ? 'hash' : 'auto');

/**
 * Load config
 */
const webpackConfig = require('../webpack.config.js');

if (!webpackConfig) {
  console.error(`Load webpack config from webpack.config.js failed!`);
  return;
}

/**
 * Start runner
 */
const path = require('path');
const os = require('os');
const ts = require('typescript');
const chalk = require('chalk');
const express = require('express');
const Webpack = require('webpack');
const createProxyMiddleware = require('http-proxy-middleware').createProxyMiddleware;
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const utils = require('./utils');
const config = require('../config');

utils.checkVersions();

console.log(chalk.cyan.bold(`TypeScript Version: ${ts.version}`));

if (nodeAction === 'run') {
  function getLocalIps(flagIpv6) {
    const ifaces = os.networkInterfaces();
    const ips = [];
    const func = (details) => {
      if (!flagIpv6 && details.family === 'IPv6') {
        return;
      }
      ips.push(details.address);
    };
    Object.values(ifaces).forEach((values) => {
      values.forEach(func);
    });
    return ips;
  }

  const getFullPath = file => path.resolve(__dirname, file);
  const serve = (filepath, cache) => express.static(getFullPath(filepath), {
    maxAge: cache && utils.isProd ? 1000 * 60 * 60 * 24 * 30 : 0,
  });

  // default port where dev server listens for incoming traffic
  const port = webpackConfig.devServer.port;
  // Define HTTP proxies to your custom API backend
  // https://github.com/chimurai/http-proxy-middleware
  const proxyTable = webpackConfig.devServer.proxy;

  const app = express();
  const compiler = Webpack(webpackConfig);
  const devMiddleware = WebpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: false,
    logLevel: 'silent',
  });

  const hotMiddleware = WebpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 2000,
  });
  // force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
      hotMiddleware.publish({ action: 'reload' });
      if (cb) cb();
    });
  });

  // proxy api requests
  Object.keys(proxyTable).forEach((context) => {
    let options = proxyTable[context];
    if (typeof options === 'string') {
      options = { target: options };
    }
    app.use(createProxyMiddleware(options.filter || context, options));
  });

  // handle fallback for HTML5 history API
  app.use(require('connect-history-api-fallback')());

  // serve webpack bundle output
  app.use((req, res, next) => {
    // console.log(`${req.url} ${req.headers['user-agent']}`);
    return devMiddleware(req, res, next);
  });

  // enable hot-reload and state-preserving
  // compilation error display
  app.use(hotMiddleware);

  // serve pure static assets
  app.use(process.env.PUBLIC_PATH, express.static(utils.fullPath(config.staticDirectory)));

  app.use('/favicon.ico', serve('../src/assets/favicon.ico'));

  let readyResolve;
  const readyPromise = new Promise((resolve) => {
    readyResolve = resolve;
  });

  console.log('> Starting dev server...');
  devMiddleware.waitUntilValid(() => {
    const ips = getLocalIps();
    ips.unshift('localhost');
    ips.forEach((ip) => {
      console.log(`> Listening at http://${ip}:${port}\n`);
    });
    readyResolve();
  });

  const server = app.listen(port);
} else {
  console.log('');
  console.log('rm -rf dist');
  utils.rm('dist').catch((error) => {
    console.log(chalk.red.bold('error: rm dist failed!'));
    throw error;
  }).then(() => {
    const compiler = Webpack(webpackConfig);
    compiler.run((err, stats) => {
      if (err) {
        console.log('Webpack compiler encountered a fatal error.', err);
        throw err;
      }
      const jsonStats = stats.toJson();
      console.log(stats.toString(webpackConfig.stats));
    });
  })
}
