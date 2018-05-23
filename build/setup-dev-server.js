/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-21 15:30:28
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2017-11-24 11:16:46
 */
/* eslint-disable id-match */
/* eslint-disable no-console */
if (!process.env.NODE_ENV) {
  console.log('Empty NODE_ENV is not allowed!\n');
  process.exit(1);
}
process.env.NODE_ACTION = 'run';

const utils = require('./utils');
const config = require('../config');

utils.checkVersions();
const isProd = process.env.NODE_ENV === 'production';

const opn = require('opn');
const path = require('path');
const os = require('os');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const getWebpackConfig = require('./webpack.base.conf');

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
const webpackConfigM = getWebpackConfig({ isMobile: true });
const compilerM = webpack(webpackConfigM);
const devMiddlewareM = require('webpack-dev-middleware')(compilerM, {
  publicPath: webpackConfigM.output.publicPath,
  quiet: true,
});

const hotMiddlewareM = require('webpack-hot-middleware')(compilerM, {
  log: false,
  heartbeat: 2000,
});
// force page reload when html-webpack-plugin template changes
compilerM.plugin('compilation', (compilation) => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddlewareM.publish({ action: 'reload' });
    cb();
  });
});

const webpackConfigPC = getWebpackConfig({ isMobile: false });
const compilerPC = webpack(webpackConfigPC);
const devMiddlewarePC = require('webpack-dev-middleware')(compilerPC, {
  publicPath: webpackConfigPC.output.publicPath,
  quiet: true,
});

const hotMiddlewarePC = require('webpack-hot-middleware')(compilerPC, {
  log: false,
  heartbeat: 2000,
});
// force page reload when html-webpack-plugin template changes
compilerPC.plugin('compilation', (compilation) => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddlewarePC.publish({ action: 'reload' });
    cb();
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
  console.log(`${req.url} ${req.headers['user-agent'].toLowerCase()}`);
  return req.headers['user-agent'].toLowerCase().indexOf('mobile') >= 0
    ? devMiddlewareM(req, res, next)
    : devMiddlewarePC(req, res, next);
});

// enable hot-reload and state-preserving
// compilation error display
app.use((req, res, next) => (
  req.headers['user-agent'].toLowerCase().indexOf('mobile') >= 0
    ? hotMiddlewareM(req, res, next)
    : hotMiddlewarePC(req, res, next)
));

// serve pure static assets
const staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

app.use('/favicon.ico', serve('../src/assets/favicon.ico'));

let readyResolve;
const readyPromise = new Promise((resolve) => {
  readyResolve = resolve;
});

console.log('> Starting dev server...');
Promise.all([
  new Promise((resolve) => {
    devMiddlewareM.waitUntilValid(resolve);
  }),
  new Promise((resolve) => {
    devMiddlewarePC.waitUntilValid(resolve);
  }),
]).then(() => {
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
