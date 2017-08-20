var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfigs = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function resolveRegex(dir) {
  return resolve(dir).replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}

const publicPath = {
  production: config.build.assetsPublicPath,
  development: config.dev.assetsPublicPath,
  rc: config.build.assetsPublicPath
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: publicPath[process.env.NODE_ENV],
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '@m': resolve('src/m'),
      '@pc': resolve('src/pc'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      { // mobile version use px2rem
        test: new RegExp('^' + resolveRegex('src/m/') + '.*\\.vue$'),
        loader: 'vue-loader',
        options: vueLoaderConfigs[0]
      },
      { // pc version disable px2rem
        test: new RegExp('^(?!' + resolveRegex('src/m/') + ').*\\.vue$'),
        loader: 'vue-loader',
        options: vueLoaderConfigs[1]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
