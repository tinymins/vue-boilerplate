/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2018-05-30 09:55:41
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
 */
/* eslint-disable id-match */
/* eslint-disable no-console */

const isProd = process.env.NODE_ENV === 'production';
const extractTextPlugin = require('extract-text-webpack-plugin');
const utils = require('./index.js');

const cssLoaders = (options = {}) => {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: isProd,
      sourceMap: options.sourceMap,
    },
  };
  const postcssLoader = 'postcss-loader';
  // generate loader string to be used with extract text plugin
  function generateLoaders(extension, loader, loaderOptions) {
    const loaders = [cssLoader, postcssLoader];
    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({
          sourceMap: options.sourceMap,
        }, loaderOptions, options[`${extension}rc`]),
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return extractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
      });
    }
    return ['vue-style-loader'].concat(loaders);
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders('css'),
    postcss: generateLoaders('postcss'),
    less: generateLoaders('less', 'less'),
    sass: generateLoaders('sass', 'sass', { indentedSyntax: true }),
    scss: generateLoaders('scss', 'sass'),
    stylus: generateLoaders('stylus', 'stylus'),
    styl: generateLoaders('styl', 'stylus'),
  };
};

// Generate loaders for standalone style files (outside of .vue)
const styleLoaders = (options) => {
  const output = [];
  const loaders = cssLoaders(options);
  Object.keys(loaders).forEach((extension) => {
    output.push({
      test: new RegExp(`\\.${utils.regexEscape(extension)}$`),
      use: loaders[extension],
    });
  });
  return output;
};

const vueLoaders = () => [{
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    compilerOptions: {
      preserveWhitespace: false,
    },
    transformAssetUrls: {
      video: ['src', 'poster'],
      source: 'src',
      img: 'src',
      image: 'xlink:href',
    },
  },
}];

exports.cssLoaders = cssLoaders;
exports.styleLoaders = styleLoaders;
exports.vueLoaders = vueLoaders;
