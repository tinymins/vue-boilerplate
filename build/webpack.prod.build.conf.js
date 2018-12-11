/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const utils = require('./utils');
const loader = require('./utils/loader');
const config = require('../config');
const webpackBaseConfig = require('./webpack.base.conf');

const webpackConfig = merge(webpackBaseConfig, {
  output: {
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [utils.fullPath('src'), utils.fullPath('test')],
        options: {
          configFile: '.eslintrc.js',
          // fix: true,
          cache: true,
          emitWarning: true,
          failOnError: false,
          formatter: eslintFriendlyFormatter,
        },
      },
      ...loader.styleLoaders({
        extract: true,
        sourceMap: config.sourceMap,
      }),
    ],
  },
  devtool: config.sourceMap
    ? '#source-map'
    : false,
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
      },
    }),
    new HtmlWebpackPlugin({
      filename: utils.fullPath('dist/index.html'),
      template: './src/index.html',
      inject: true,
      favicon: utils.fullPath('src/assets/favicon.ico'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module =>
        // any required modules inside node_modules are extracted to vendor
        module.resource
        && /\.js$/.test(module.resource)
        && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
      ,
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor'],
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: utils.fullPath(config.assetsSubDirectory),
        to: config.assetsSubDirectory,
        ignore: ['.*'],
      },
    ]),
    // Make sure that the plugin is after any plugins that add images
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
  ],
});

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
