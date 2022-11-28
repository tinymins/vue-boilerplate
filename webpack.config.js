/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

/**
 * Set environments (fallback to build)
 */
require('./webpack/env').fallback(['build']);

/**
 * Require must after set environments
 */
const chalk = require('chalk');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const moment = require('moment');
const MomentLocalesWebpackPlugin = require('moment-locales-webpack-plugin');
const path = require('path');
const openBrowser = require('react-dev-utils/openBrowser');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const merge = require('webpack-merge').merge;
const WebpackBar = require('webpackbar');

const GenerateSW = require('workbox-webpack-plugin').GenerateSW;
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;

const loaders = require('./webpack/loaders');
const plugins = require('./webpack/plugins');
const utils = require('./webpack/utils');
const packageConfig = require('./package.json');

const PUBLIC_PATHNAME = process.env.PUBLIC_PATH.replace(/https?:\/\/[^/]+/u, '');

const currentTime = Date.now();
const BUILD_TIMESTAMP = String(currentTime);
const BUILD_TIME_STRING = moment(currentTime).format('YYYY/MM/DD HH:mm:ss');

// https://webpack.js.org/configuration/stats/
const stats = utils.isProd
  ? {
    colors: true,
    entrypoints: false,
    modules: false,
    children: false,
  }
  : 'minimal';

let skipInstruction = false;

/** @type {webpack.Configuration[]} */
const webpackConfigs = [{
  entry: {
    app: utils.fullPath('src/entry/client.ts'),
  },
  output: {
    path: process.env.DIST_PATH,
    filename: 'js/[name].[chunkhash:4].js',
    chunkFilename: 'js/[name].[chunkhash:4].js',
    publicPath: process.env.PUBLIC_PATH,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.tx', '.json', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': utils.fullPath('src'),
      ':': utils.fullPath('static'),
    },
    modules: [
      utils.fullPath('src'),
      'node_modules',
    ],
    fallback: {
      path: require.resolve('path-browserify'),
      util: require.resolve('util/'),
    },
  },
  module: {
    rules: [
      ...loaders.scriptLoaders(),
      ...loaders.styleLoaders({ extract: true }),
      ...loaders.assetsLoaders(),
    ],
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      // It's recommended to set cache.buildDependencies.config: [__filename] in your webpack configuration to get the latest configuration and all dependencies.
      // https://webpack.js.org/configuration/cache/#cachebuilddependencies
      config: [__filename],
    },
  },
  plugins: [
    // util requires this internally
    new webpack.ProvidePlugin({ process: 'process/browser' }),
    // To strip all locales except “en” and “zh-cn”
    // (“en” is built into Moment and can’t be removed)
    new MomentLocalesWebpackPlugin({
      localesToKeep: ['zh-cn'],
    }),
    // new CaseSensitivePathsPlugin(),
    new WebpackBar({
      name: `${utils.isProd ? 'Production' : 'Development'}: ${process.env.BUILD_TARGET}`,
      color: utils.isProd ? '#569fff' : '#0dbc79',
    }),
    // new webpack.ProgressPlugin({ percentBy: 'entries' }),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new VueLoaderPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      NODE_ACTION: process.env.NODE_ACTION,
      ROUTER_MODE: process.env.ROUTER_MODE,
      PUBLIC_PATH: process.env.PUBLIC_PATH,
      BUILD_TIMESTAMP,
      BUILD_TIME_STRING,
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: utils.fullPath('index.html'),
      inject: 'body',
      title: packageConfig.title,
      // favicon: utils.fullPath('src/assets/favicon.ico'),
      publicPath: process.env.PUBLIC_PATH,
    }),
    // Webpack plugin that runs TypeScript type checker on a separate process.
    new ForkTsCheckerWebpackPlugin(),
  ],
}];

if (utils.isProd) {
  webpackConfigs.push({
    mode: 'production',
    optimization: {
      runtimeChunk: {
        name: 'runtime', // webpack runtime
      },
      chunkIds: 'named',
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 2,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        automaticNameDelimiter: '.',
        cacheGroups: {
          vue: {
            filename: 'js/vue-family-bundle.js',
            name: 'vue-family-bundle',
            test: /[/\\]node_modules[/\\](vue|vue-router|vuex|vuex-router-sync)[/\\]/u,
            chunks: 'initial',
          },
          route: {
            filename: 'js/route.[hash:24].js',
            name: 'route',
            test: /[/\\]src[/\\](router)[/\\]/u,
            chunks: 'initial',
          },
          store: {
            filename: 'js/store.[hash:24].js',
            name: 'store',
            test: /[/\\]src[/\\](store)[/\\]/u,
            chunks: 'initial',
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
      minimizer: [
        new CssMinimizerWebpackPlugin({
          minify: CssMinimizerWebpackPlugin.cssnanoMinify,
          minimizerOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
        }),
        new TerserWebpackPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              // collapse_vars: false, // Bug: https://github.com/terser-js/terser/issues/369
              // drop_console: true,
              // pure_funcs: ['console.log'],
            },
            mangle: true, // Note `mangle.properties` is `false` by default.
          },
        }),
      ],
    },
    performance: {
      hints: 'warning',
      maxAssetSize: 3000000,
      maxEntrypointSize: 2000000,
    },
    stats,
  });
} else {
  webpackConfigs.push({
    mode: 'development',
    stats,
    devtool: 'inline-source-map',
  });
}

if (utils.isRun) {
  webpackConfigs.push({
    // https://webpack.js.org/configuration/dev-server/
    devServer: {
      static: {
        directory: path.join(__dirname, './static'),
        publicPath: `${PUBLIC_PATHNAME}static`,
      },
      client: {
        overlay: {
          warnings: false,
          errors: true,
        },
      },
      historyApiFallback: {
        disableDotRule: true,
        rewrites: [
          { from: /./u, to: path.posix.normalize(path.posix.join(PUBLIC_PATHNAME, '/index.html')) },
        ],
      },
      hot: true,
      compress: true,
      host: '0.0.0.0',
      port: process.env.PORT,
      allowedHosts: 'all',
      // Define HTTP proxies to your custom API backend
      // https://github.com/chimurai/http-proxy-middleware
      proxy: {
        '/api': {
          target: 'https://dev.haimanchajian.com',
          pathRewrite: {
            '^/api': '/api',
          },
          changeOrigin: true,
        },
      },
      devMiddleware: {
        publicPath: PUBLIC_PATHNAME,
        stats,
      },
      onListening: (server) => {
        const { port } = server.server.address();
        server.compiler.hooks.done.tap('done', () => {
          if (skipInstruction) {
            return;
          }
          setImmediate(() => {
            console.log();
            console.log(chalk.green.bold('Running at ') + chalk.cyan.bold(`http://localhost:${port}${PUBLIC_PATHNAME}`) + ' '.repeat(10) + chalk.magenta.bold(`[${packageConfig.name}]`));
            console.log();
            openBrowser(`http://localhost:${port}${PUBLIC_PATHNAME}`);
            skipInstruction = true;
          });
        });
      },
    },
  });
} else {
  webpackConfigs.push({
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './static',
            to: './static',
            filter: pathname => !pathname.endsWith('/.gitkeep'),
            noErrorOnMissing: true,
          },
        ],
      }),
      new WebpackAssetsManifest({
        transform: (assets, manifest) => ({
          publicPath: process.env.PUBLIC_PATH,
        }),
        output: 'json/manifest.json',
      }),
    ],
  });

  if (process.env.BUILD_TARGET === 'chrome-ext') {
    webpackConfigs.push({
      entry: utils.fullPath('src/entry/chrome-ext.ts'),
      plugins: [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: utils.fullPath('src/extra/chrome-ext/manifest.json'),
              to: './',
              filter: pathname => !pathname.endsWith('/.gitkeep'),
            },
          ],
        }),
      ],
    });
  } else {
    webpackConfigs.push({
      plugins: [
        // auto generate service worker
        new GenerateSW({
          cacheId: packageConfig.name,
          swDest: 'service-worker.js',
          dontCacheBustURLsMatching: /static\//u,
          exclude: [/\.html$/u, /\.map$/u, /\.json$/u],
          runtimeCaching: [
            {
              urlPattern: /\/(m\/static)/u,
              handler: 'NetworkFirst',
            },
          ],
        }),
      ],
    });
  }
}

if (process.env.ESLINT !== 'N') {
  webpackConfigs.push({
    plugins: [
      plugins.eslintPlugin({
        cache: false,
        failOnError: !utils.isRun,
      }),
    ],
  });
}

if (process.env.STYLELINT !== 'N') {
  webpackConfigs.push({
    plugins: [
      plugins.stylelintPlugin({
        failOnError: !utils.isRun,
      }),
    ],
  });
}

if (process.env.REPORT === 'Y' && !utils.isRun) {
  webpackConfigs.push({
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ],
  });
}

let webpackConfig = merge(webpackConfigs);

if (process.env.REPORT === 'Y' && !utils.isRun) {
  const smp = new SpeedMeasurePlugin();
  webpackConfig = smp.wrap(webpackConfig);
}

// SpeedMeasurePlugin conflict with MiniCssExtractPlugin.
// https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167#issuecomment-1040022776
webpackConfig.plugins.push(
  new MiniCssExtractPlugin({
    filename: 'css/[name].[chunkhash:4].css',
    chunkFilename: 'css/[name].[chunkhash:4].css',
    ignoreOrder: true,
  }),
);

module.exports = webpackConfig;
