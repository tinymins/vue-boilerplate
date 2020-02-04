/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// const ImageminPlugin = require('imagemin-webpack-plugin').default;
const { GenerateSW } = require('workbox-webpack-plugin');
const utils = require('../utils');
const loader = require('../utils/loader');
const plugin = require('../utils/plugin');
const config = require('../config');
const webpackBaseConfig = require('./webpack.base.conf');

const seen = new Set();
const nameLength = 4;

const webpackConfig = merge(webpackBaseConfig, {
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      ...loader.styleLoaders({ extract: true }),
    ],
  },
  plugins: [
    new WebpackBar({
      name: 'Client-Prod',
      color: '#569fff'
    }),
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
        while (seen.has(joinedHash.substr(0, len))) len++;
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
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: utils.fullPath(config.staticDirectory),
        to: utils.fullPath(config.distributionDirectory),
        ignore: ['.*'],
      },
    ]),
    // new ImageminPlugin({
    //   test: /\.(jpe?g|png|gif|svg)$/i,
    //   cacheFolder: utils.fullPath('node_modules/.cache/imagemin-plugin'),
    // }),
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

webpackConfig.optimization.minimizer = [
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
];

if (config.useESLint) {
  webpackConfig.module.rules.push(
    ...loader.eslintLoaders({
      cache: true,
      emitWarning: true,
      failOnError: true,
    }),
  );
}

if (config.useStyleLint) {
  webpackConfig.plugins.push(
    plugin.stylelintPlugin({
      failOnError: true,
    }),
  );
}

if (config.bundleAnalyzerReport) {
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
  }));
}

if (config.productionGzip) {
  webpackConfig.plugins.push(new CompressionWebpackPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: new RegExp(`\\.(${config.productionGzipExtensions.join('|')})$`),
    threshold: 10240,
    minRatio: 0.8,
  }));
}

module.exports = webpackConfig;
