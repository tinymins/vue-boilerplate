/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-21 10:14:02
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-06 16:04:05
 */
/* eslint-disable id-match, no-nested-ternary */
const path = require('path');
const utils = require('./utils');
const loader = require('./utils/loader');
const config = require('../config');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const StyleLintPlugin = require('stylelint-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const PostCompilePlugin = require('webpack-post-compile-plugin');
const TransformModulesPlugin = require('webpack-transform-modules-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const isRun = process.env.NODE_ACTION === 'run';
const isBuild = process.env.NODE_ACTION === 'build';
const isProd = process.env.NODE_ENV === 'production';

module.exports = ({ isMobile = true } = {}) => {
  const webpackConfig = {
    entry: {
      m: './src/m.js',
      pc: './src/pc.js',
    },
    output: {
      path: config.assetsRoot,
      publicPath: config.assetsPublicPath,
      filename: isProd
        ? utils.assetsPath('js/[name].[chunkhash].js')
        : utils.assetsPath('js/[name].[hash].js'),
      chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': utils.fullPath('src'),
        ':': utils.fullPath('static'),
      },
      modules: [
        utils.fullPath('src'),
        utils.fullPath('node_modules'),
      ],
    },
    module: {
      noParse: /es6-promise\.js$/, // avoid webpack shimming process
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [utils.fullPath('src'), utils.fullPath('test')],
          options: {
            cache: true,
            emitWarning: isRun,
            failOnError: !isRun,
            formatter: eslintFriendlyFormatter,
          },
        },
        ...loader.vueLoaders(),
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [utils.fullPath('src'), utils.fullPath('test'), utils.fullPath('node_modules/cube-ui')],
        },
        ...loader.styleLoaders({
          extract: isProd,
          sourceMap: config.sourceMap,
          stylrc: { 'resolve url': true },
          stylusrc: { 'resolve url': true },
        }),
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]'),
          },
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]'),
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
          },
        },
      ],
    },
    devtool: isRun
      // cheap-module-eval-source-map is faster for localhost dev
      ? (config.sourceMap ? '#cheap-module-eval-source-map' : false)
      : (config.sourceMap ? '#source-map' : false),
    plugins: [
      ...[
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new VueLoaderPlugin(),
        new PostCompilePlugin(),
        new TransformModulesPlugin(),
        new webpack.DefinePlugin({
          'process.env': (() => {
            const env = {};
            Object.keys(config.env).forEach((k) => {
              env[k] = JSON.stringify(config.env[k]);
            });
            return env;
          })(),
        }),
        isProd ? new webpack.optimize.ModuleConcatenationPlugin() : null,
        isProd ? new BundleAnalyzerPlugin({
          analyzerMode: 'static',
        }) : null,
        isProd ? new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
          },
          sourceMap: true,
        }) : null,
        // extract css into its own file
        isProd ? new ExtractTextPlugin({
          filename: utils.assetsPath('css/[name].[contenthash].css'),
        }) : null,
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        isProd ? new OptimizeCSSPlugin({
          cssProcessorOptions: {
            safe: true,
          },
        }) : null,
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        isRun ? new webpack.HotModuleReplacementPlugin() : null,
        isRun ? new webpack.NoEmitOnErrorsPlugin() : null,
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        isRun ? new HtmlWebpackPlugin({
          filename: 'index.html',
          template: isMobile ? './src/m.html' : './src/pc.html',
          inject: true,
          excludeChunks: [isMobile ? 'pc' : 'm'],
          favicon: utils.fullPath('src/assets/favicon.ico'),
        }) : null,
        isBuild ? new HtmlWebpackPlugin({
          filename: utils.fullPath('dist/m.html'),
          template: './src/m.html',
          inject: true,
          favicon: utils.fullPath('src/assets/favicon.ico'),
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
          },
          excludeChunks: ['pc'],
          // necessary to consistently work with multiple chunks via CommonsChunkPlugin
          chunksSortMode: 'dependency',
        }) : null,
        isBuild ? new HtmlWebpackPlugin({
          filename: utils.fullPath('dist/pc.html'),
          template: './src/pc.html',
          inject: true,
          favicon: utils.fullPath('src/assets/favicon.ico'),
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
          },
          excludeChunks: ['m'],
          // necessary to consistently work with multiple chunks via CommonsChunkPlugin
          chunksSortMode: 'dependency',
        }) : null,
        // split vendor js into its own file
        isProd ? new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: module =>
            // any required modules inside node_modules are extracted to vendor
            module.resource
            && /\.js$/.test(module.resource)
            && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
          ,
        }) : null,
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        isProd ? new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest',
          chunks: ['vendor'],
        }) : null,
        // copy custom static assets
        isProd ? new CopyWebpackPlugin([
          {
            from: utils.fullPath(config.assetsSubDirectory),
            to: config.assetsSubDirectory,
            ignore: ['.*'],
          },
        ]) : null,
        new FriendlyErrorsPlugin(),
        new StyleLintPlugin({
          files: [
            'src/**/*.vue',
            'src/**/*.css',
            'src/**/*.less',
            'src/**/*.sass',
            'src/**/*.scss',
            '!**/iconfont.css',
          ],
          cache: true,
          cacheLocation: './node_modules/.stylelintcache',
          emitErrors: !isRun,
          failOnError: !isRun,
        }),
      ].filter(_ => _),
    ],
  };

  if (isRun) {
    // add hot-reload related code to entry chunks
    Object.keys(webpackConfig.entry).forEach((name) => {
      webpackConfig.entry[name] = [
        'eventsource-polyfill',
        './build/utils/webpack-hot-middleware-client',
      ].concat(webpackConfig.entry[name]);
    });
  }

  return webpackConfig;
};
