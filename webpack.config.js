/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const path = require('path');
const express = require('express');
const ts = require('typescript');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackBar = require('webpackbar');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const GenerateSW = require('workbox-webpack-plugin').GenerateSW;
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = require('./config');
const utils = require('./webpack/utils');
const loaders = require('./webpack/loaders');
const plugins = require('./webpack/plugins');

// HTML plugin
// #1669 html-webpack-plugin's default sort uses toposort which cannot
// handle cyclic deps in certain cases. Monkey patch it to handle the case
// before we can upgrade to its 4.0 version (incompatible with preload atm)
const chunkSorters = require('html-webpack-plugin/lib/chunksorter');
const depSort = chunkSorters.dependency;
chunkSorters.auto = chunkSorters.dependency = (chunks, ...args) => {
  try {
    return depSort(chunks, ...args)
  } catch (e) {
    // fallback to a manual sort if that happens...
    return chunks.sort((a, b) => {
      // make sure user entry is loaded last so user CSS can override
      // vendor CSS
      if (a.id === 'app') {
        return 1
      } else if (b.id === 'app') {
        return -1
      } else if (a.entry !== b.entry) {
        return b.entry ? -1 : 1
      }
      return 0
    })
  }
}

const webpackConfigs = [{
  entry: config.clientEntry,
  output: {
    path: utils.fullPath(config.distributionDirectory),
    publicPath: process.env.PUBLIC_PATH,
    filename: utils.formatDistributionAssetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.formatDistributionAssetsPath('js/[name].[chunkhash].js'),
  },
  resolve: config.resolve,
  optimization: {
    runtimeChunk: {
      name: 'runtime', // webpack runtime
    },
    // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/113
    // 无解
    splitChunks: {
      // chunks: 'initial', // initial all async
      cacheGroups: {
        styles: {
          test: m => m.constructor.name === 'CssModule',
          name: 'commons',
          minChunks: 2,
          chunks: 'all',
          reuseExistingChunk: true,
          // enforce: true,
        },
        vue: {
          filename: utils.formatDistributionAssetsPath('js/vue-family-bundle.js'),
          name: 'vue-family-bundle',
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex|vuex-router-sync)[\\/]/,
          chunks: 'initial',
        },
        route: {
          filename: utils.formatDistributionAssetsPath('js/route.[hash:24].js'),
          name: 'route',
          test: /[\\/]src[\\/](router)[\\/]/,
          chunks: 'initial',
        },
        store: {
          filename: utils.formatDistributionAssetsPath('js/store.[hash:24].js'),
          name: 'store',
          test: /[\\/]src[\\/](store)[\\/]/,
          chunks: 'initial',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    rules: [
      ...loaders.vueLoaders(),
      ...loaders.scriptLoaders({ cache: !config.useESLint }),
      ...loaders.staticLoaders(),
    ],
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new VueLoaderPlugin(),
    new webpack.EnvironmentPlugin(config.env),
    new webpack.ContextReplacementPlugin(
      /moment[\\/]locale$/,
      /^\.\/(zh-cn)$/,
    ),
    // keep module.id stable when vendor modules does not change
    new webpack.NamedChunksPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: config.title,
      filename: config.distributionIndex,
      template: utils.fullPath('template/index.html'),
      // favicon: utils.fullPath('src/assets/favicon.ico'),
      inject: true,
      publicPath: process.env.PUBLIC_PATH,
    }),
    new FilterWarningsPlugin({
      exclude: /export .* was not found in/,
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
}];

if (utils.isProd) {
  const seen = new Set();
  const nameLength = 4;

  webpackConfigs.push({
    mode: 'production',
    stats: {
      // https://webpack.js.org/configuration/stats/
        colors: true,
        entrypoints: false,
        modules: false,
        children: false,
    },
    devtool: false,
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          assetNameRegExp: /\.css(\?.*)?$/,
          cssProcessorOptions: {
            safe: true,
          },
        }),
        new TerserPlugin({
          cache: false,
          parallel: true,
          terserOptions: {
            compress: {
              collapse_vars: false, // Bug: https://github.com/terser-js/terser/issues/369
            },
            mangle: true, // Note `mangle.properties` is `false` by default.
          },
        }),
      ],
    },
    module: {
      rules: [
        ...loaders.styleLoaders({ extract: true }),
      ],
    },
    plugins: [
      // https://github.com/vuejs/vue-cli/issues/1916#issuecomment-407693467
      // https://segmentfault.com/a/1190000015919928#articleHeader10
      new webpack.NamedChunksPlugin((chunk) => {
        if (chunk.name) {
          return chunk.name;
        }
        const modules = Array.from(chunk.modulesIterable);
        if (modules.length > 1) {
          const hash = require('hash-sum');
          const joinedHash = hash(modules.map(m => m.id).join('_'));
          let len = nameLength;
          while (seen.has(joinedHash.substr(0, len))) {
            len++;
          };
          seen.add(joinedHash.substr(0, len));
          return `chunk-${joinedHash.substr(0, len)}`;
        }
        return `module-${modules[0].id}`;
      }),
      // extract css into its own file
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: utils.formatDistributionAssetsPath('css/[name].[contenthash].css'),
      }),
      // new ImageminPlugin({
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   cacheFolder: utils.fullPath('node_modules/.cache/imagemin-plugin'),
      // }),
    ],
  });
} else {
  webpackConfigs.push({
    mode: 'development',
    module: {
      rules: [
        ...loaders.styleLoaders({ extract: true }),
      ],
    },
    stats: 'minimal',
    // cheap-module-eval-source-map is faster for localhost dev
    devtool: '#source-map',
    plugins: [
      new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
      // extract css into its own file
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: utils.formatDistributionAssetsPath('css/[name].css'),
      }),
      // Friendly-errors-webpack-plugin recognizes certain classes of
      // webpack errors and cleans, aggregates and prioritizes them
      // to provide a better Developer Experience.
      // https://github.com/geowarin/friendly-errors-webpack-plugin#readme
      new FriendlyErrorsPlugin(),
    ],
  });
}

if (utils.isRun) {
  webpackConfigs.push({
    output: {
      publicPath: '/',
      filename: utils.formatDistributionAssetsPath('js/[name].js'),
      chunkFilename: utils.formatDistributionAssetsPath('js/[name].js'),
    },
    // https://webpack.js.org/configuration/dev-server/
    devServer: {
      clientLogLevel: 'warning',
      historyApiFallback: {
        disableDotRule: true,
        rewrites: [
          { from: /./, to: path.posix.join('/', config.distributionIndex) },
        ],
      },
      hot: true,
      contentBase: false, // since we use CopyWebpackPlugin.
      compress: true,
      host: process.env.HOST || config.host,
      // port: process.env.PORT && Number(process.env.PORT) || config.port,
      autoOpenBrowser: false,
      useLocalIp: true,
      overlay: config.errorOverlay
        ? { warnings: false, errors: true }
        : false,
      publicPath: '/',
      proxy: {
        '/api': {
          target: 'https://dev.haimanchajian.com',
          pathRewrite: {
            '^/api': '/api',
          },
          changeOrigin: true,
        },
      },
      quiet: true,
      watchOptions: {
        poll: config.poll,
        ignored: config.watchNodeModules
          ? []
          : ['node_modules/**'],
      },
      before: (app) => {
        app.use('/', express.static(utils.fullPath(config.staticDirectory)))
      }
    },
    plugins: [
      // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
} else {
  webpackConfigs.push({
    // output: {
    //   filename: utils.formatDistributionAssetsPath('js/[name].[hash:24].js'),
    // },
    module: {
      noParse: /es6-promise\.js$/, // avoid webpack shimming process
    },
    plugins: [
      // copy custom static assets
      new CopyWebpackPlugin([
        {
          from: utils.fullPath(config.staticDirectory),
          to: utils.fullPath(config.distributionDirectory),
          ignore: ['.*'],
        },
      ]),
    ],
  });

  if (config.chromeExt) {
    webpackConfigs.push({
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
  } else {
    webpackConfigs.push({
      plugins: [
        // auto generate service worker
        new GenerateSW({
          cacheId: config.id,
          swDest: 'service-worker.js',
          dontCacheBustURLsMatching: /static\//,
          exclude: [/\.html$/, /\.map$/, /\.json$/],
          runtimeCaching: [
            {
              urlPattern: /\/(m\/static)/,
              handler: 'NetworkFirst',
            },
          ],
        }),
      ],
    });
  }
}

if (!utils.isRun && config.chromeExt) {
  webpackConfigs.push({
    plugins: [
      new WebpackBar({
        name: 'Chrome-Ext',
        color: '#ab71f3',
      }),
    ],
  });
} else if (utils.isProd) {
  webpackConfigs.push({
    plugins: [
      new WebpackBar({
        name: 'Client-Prod',
        color: '#569fff'
      }),
    ],
  });
} else {
  webpackConfigs.push({
    plugins: [
      new WebpackBar({
        name: 'Client-Dev',
      }),
    ],
  });
}

if (config.useESLint) {
  webpackConfigs.push({
    plugins: [
      plugins.eslintPlugin({
        cache: false,
        failOnError: !utils.isRun,
      }),
    ],
  });
}

if (config.useStyleLint) {
  webpackConfigs.push({
    plugins: [
      plugins.stylelintPlugin({
        failOnError: !!utils.isProd,
      }),
    ],
  });
}

if (config.bundleAnalyzerReport && !utils.isRun) {
  webpackConfigs.push({
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ],
  });
}

if (config.productionGzip && !utils.isRun) {
  webpackConfigs.push({
    plugins: [
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(`\\.(${config.productionGzipExtensions.join('|')})$`),
        threshold: 10240,
        minRatio: 0.8,
      }),
    ],
  });
}

module.exports = merge(webpackConfigs);
