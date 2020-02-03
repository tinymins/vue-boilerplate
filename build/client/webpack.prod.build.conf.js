/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// const ImageminPlugin = require('imagemin-webpack-plugin').default;
const { GenerateSW } = require('workbox-webpack-plugin');
const utils = require('../utils');
const loader = require('../utils/loader');
const plugin = require('../utils/plugin');
const config = require('../config');
const webpackBaseConfig = require('./webpack.base.conf');

const webpackConfig = merge(webpackBaseConfig, {
  mode: 'production',
  output: {
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
  },
  module: {
    rules: [
      ...loader.eslintLoaders({
        cache: true,
        emitWarning: true,
        failOnError: true,
      }),
      ...loader.styleLoaders(true),
    ],
  },
  devtool: false,
  plugins: [
    plugin.stylelintPlugin({
      failOnError: true,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: utils.assetsPath('css/[name].[contenthash].css'),
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: utils.fullPath(config.assetsSubDirectory),
        to: config.assetsSubDirectory,
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
