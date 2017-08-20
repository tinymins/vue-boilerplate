var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

function GeneLoaderConfig(px2rem) {
  var output = {
    loaders: utils.cssLoaders({
      sourceMap: isProduction
        ? config.build.productionSourceMap
        : config.dev.cssSourceMap,
      extract: isProduction
    }, px2rem),
    transformToRequire: {
      video: 'src',
      source: 'src',
      img: 'src',
      image: 'xlink:href'
    },
    postcss: [
      require('autoprefixer')({
        browsers: ['last 10 versions']
      })
    ]
  }
  if (px2rem) {
    output.postcss.push(
      require('postcss-px2rem')(config.px2rem)
    );
  }
  return output
}

module.exports = [
  GeneLoaderConfig(true),
  GeneLoaderConfig(false)
]
