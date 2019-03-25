/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint-disable id-match */
/* eslint-disable no-console */

const isProd = process.env.NODE_ENV === 'production';

const opn = require('opn');
const path = require('path');
const os = require('os');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const utils = require('./utils');
const webpackConfig = process.env.NODE_ENV === 'production'
  ? require('./webpack.prod.run.conf')
  : require('./webpack.dev.run.conf');
const config = require('../config');

utils.checkVersions();

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
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0,
});

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.port;
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.proxyTable;

const app = express();
const compiler = webpack(webpackConfig);
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
  app.use(proxyMiddleware(options.filter || context, options));
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
const staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

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
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(`http://localhost:${port}`);
  }
  readyResolve();
});

const server = app.listen(port);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close();
  },
};
