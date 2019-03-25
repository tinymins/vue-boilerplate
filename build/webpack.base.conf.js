/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const PostCompilePlugin = require('webpack-post-compile-plugin');
const TransformModulesPlugin = require('webpack-transform-modules-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin'); // 连这种东西都需要一个插件 SX
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ts = require('typescript');
const utils = require('./utils');
const loader = require('./utils/loader');
const config = require('../config');

console.log(`Typescript Version: ${ts.version}`);

const webpackConfig = {
  entry: {
    app: './src/main.js',
  },
  stats: {
    // https://webpack.js.org/configuration/stats/
    entrypoints: false,
    children: false,
  },
  output: {
    path: config.assetsRoot,
    publicPath: config.assetsPublicPath,
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
  },
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
          filename: utils.assetsPath('js/vue-family-bundle.js'),
          name: 'vue-family-bundle',
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex|vuex-router-sync)[\\/]/,
          chunks: 'initial',
        },
        route: {
          filename: utils.assetsPath('js/route.[hash:24].js'),
          name: 'route',
          test: /[\\/]src[\\/](router)[\\/]/,
          chunks: 'initial',
        },
        store: {
          filename: utils.assetsPath('js/store.[hash:24].js'),
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
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.vue', '.json'],
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
    rules: [
      ...loader.vueLoaders(),
      ...loader.scriptLoaders(),
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: utils.assetsPath('img/[hash:32].[ext]'),
            },
          },
          {
            loader: 'image-webpack-loader',
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: utils.assetsPath('media/[hash:32].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: utils.assetsPath('fonts/[hash:32].[ext]'),
        },
      },
    ],
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new VueLoaderPlugin(),
    new WebpackBar(),
    new PostCompilePlugin(),
    new TransformModulesPlugin(),
    new webpack.ContextReplacementPlugin(
      /moment[\\/]locale$/,
      /^\.\/(zh-cn)$/,
    ),
    new webpack.DefinePlugin({
      'process.env': (() => {
        const env = {};
        Object.keys(config.env).forEach((k) => {
          env[k] = JSON.stringify(config.env[k]);
        });
        return env;
      })(),
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.NamedChunksPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: config.title,
      chunksSortMode: 'none',
      filename: 'index.html',
      template: './index.html',
      inject: true,
      favicon: utils.fullPath('src/assets/favicon.ico'),
    }),
    new StylelintBarePlugin({
      configFile: '.stylelintrc.js',
      files: [
        'src/**/*.vue',
        'src/**/*.css',
        'src/**/*.less',
        'src/**/*.sass',
        'src/**/*.scss',
        '!**/iconfont.css',
      ],
      // fix: true,
      cache: true,
      cacheLocation: './node_modules/.cache/.stylelintcache',
      emitErrors: true,
      failOnError: true,
    }),
    // Silence mini-css-extract-plugin generating lots of warnings for CSS ordering.
    // We use CSS modules that should not care for the order of CSS imports, so we
    // should be safe to ignore these.
    //
    // See: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
    new FilterWarningsPlugin({
      exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
    }),
  ],
};

module.exports = webpackConfig;
