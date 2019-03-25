/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint-disable id-match */
/* eslint-disable no-console */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const utils = require('./index.js');

const cacheLoader = {
  loader: 'cache-loader',
  options: { cacheDirectory: utils.fullPath('./node_modules/.cache/cache-loader') },
};

// Generate loaders for standalone style files (outside of .vue)
const styleLoaders = (extract) => {
  // 没必要其实 最多加个 sourceMap 压缩的事情给别的插件负责
  // const cssOptions = {
  //   minimize: isProd,
  //   sourceMap: options.sourceMap,
  // }
  const cssModules = {
    modules: true,
    localIdentName: '[path][name]__[local]--[hash:base64:5]',
  };
  const map = {
    scss: 'sass-loader',
    styl: { loader: 'stylus-loader' },
    stylus: { loader: 'stylus-loader' },
  };
  const cssModulesRules = ['css', 'scss', 'styl', 'stylus'].map((extension) => {
    const devLoader = extract ? MiniCssExtractPlugin.loader : 'vue-style-loader';
    const rule = {
      test: new RegExp(`\\.module\\.${extension}$`),
      use: [
        devLoader,
        cacheLoader,
        { loader: 'css-loader', options: cssModules },
        'postcss-loader',
      ],
    };
    if (map[extension]) {
      rule.use.push(map[extension]);
    }
    return rule;
  });
  const cssRules = ['css', 'scss', 'styl', 'stylus'].map((extension) => {
    const devLoader = extract ? MiniCssExtractPlugin.loader : 'vue-style-loader';
    const rule = {
      test: new RegExp(`\\.${extension}$`),
      exclude: new RegExp(`\\.module\\.${extension}$`),
      use: [devLoader, cacheLoader, 'css-loader', 'postcss-loader'],
    };
    if (map[extension]) {
      rule.use.push(map[extension]);
    }
    return rule;
  });
  return cssRules.concat(...cssModulesRules);
};

const vueLoaders = () => [{
  test: /\.vue$/,
  use: [
    cacheLoader,
    {
      loader: 'vue-loader',
      options: { // https://github.com/vuejs/vue-loader/blob/62a9155d00212f17e24c1ae05445c156b31e2fbd/docs/options.md
        compilerOptions: {
          // preserveWhitespace: false, // do not enable, will cause some bug when render list
        },
        transformAssetUrls: {
          video: ['src', 'poster'],
          source: 'src',
          img: 'src',
          image: 'xlink:href',
        },
      },
    }
  ],
}];

const scriptLoaders = () => {
  const includes = [
    utils.fullPath('config'),
    utils.fullPath('src'),
    utils.fullPath('test'),
  ];
  return [
    {
      test: /\.m?jsx?$/,
      use: [cacheLoader, 'babel-loader'],
      include: includes,
    },
    {
      test: /\.ts$/,
      include: includes,
      use: [
        cacheLoader,
        'babel-loader',
        {
          loader: 'ts-loader',
          options: {
            // "transpileOnly":true,
            // "happyPackMode":false,
            appendTsSuffixTo: [/\.vue$/],
          },
        },
      ],
    },
    {
      test: /\.tsx$/,
      include: includes,
      use: [
        cacheLoader,
        'babel-loader',
        {
          loader: 'ts-loader',
          options: {
            // "transpileOnly":true,
            // "happyPackMode":false,
            appendTsxSuffixTo: [/\.vue$/],
          },
        },
      ],
    },
    // {
    //   test: /\.(js|tsx?)$/,
    //   loader: 'babel-loader',
    //   include: [
    //     utils.fullPath('config'),
    //     utils.fullPath('src'),
    //     utils.fullPath('test'),
    //   ],
    // },
    // {
    //   test: /\.tsx?$/, // 保障 .vue 文件中 lang=ts
    //   loader: 'ts-loader',
    //   options: {
    //     appendTsSuffixTo: [/\.vue$/],
    //     appendTsxSuffixTo: [/\.vue$/],
    //   },
    // },
  ];
};

const eslintLoaders = options => [{
  test: /\.(ts|tsx|js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [utils.fullPath('src'), utils.fullPath('test')],
  options: Object.assign({
    configFile: '.eslintrc.js',
    // fix: true,
    cache: false,
    emitWarning: false,
    failOnError: true,
    formatter: eslintFriendlyFormatter,
  }, options),
}];

exports.styleLoaders = styleLoaders;
exports.vueLoaders = vueLoaders;
exports.scriptLoaders = scriptLoaders;
exports.eslintLoaders = eslintLoaders;
