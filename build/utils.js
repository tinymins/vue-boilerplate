var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

function resolveRegex(dir) {
  return resolve(dir).replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options, px2rem = true) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap,
    }
  }
  var px2remLoader = {
    loader: 'px2rem-loader',
    options: config.px2rem,
  }
  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (px2rem) {
      loaders.push(px2remLoader)
    }
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options, true) // mobile version use px2rem
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('^' + resolveRegex('src/m/') + '.*\\.' + extension + '$'),
      use: loader
    })
  }
  var loaders = exports.cssLoaders(options, false) // pc version disable px2rem
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('^(?!' + resolveRegex('src/m/') + ').*\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
