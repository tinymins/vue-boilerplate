/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const utils = require('./index.js');

const cacheLoader = (path) => {
  return {
    loader: 'cache-loader',
    options: { cacheDirectory: utils.fullPath(`./node_modules/.cache/cache-loader/${utils.isProd ? 'prod' : 'dev'}/${path}`) },
  };
};

const threadLoader = {
  loader: 'thread-loader',
  options: {
      // there should be 1 cpu for the fork-ts-checker-webpack-plugin
      workers: require('os').cpus().length - 1,
      poolTimeout: utils.isRun ? Infinity : 500,
  },
}

// Generate loaders for standalone style files (outside of .vue)
const styleLoaders = (options = {}) => {

  const map = {
    scss: 'sass-loader',
    less: 'less-loader',
    styl: 'stylus-loader',
    stylus: 'stylus-loader',
  };

  // 现在默认都提取就好了
  const devLoader = options.extract
    ? {
      loader: MiniCssExtractPlugin.loader,
      options: {
        // only enable hot in development
        hmr: utils.isRun,
        // if hmr does not work, this is a forceful method.
        // reloadAll: true,
      },
    }
    : 'vue-style-loader';

  const cssRules = ['css', 'scss'].map((extension) => {
    let rule = {
      test: new RegExp(`\\.${extension}$`),
      use: [
        cacheLoader('css-loader'),
        {
          loader: 'css-loader',
          options: {
            modules: {
              auto: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              exportOnlyLocals: options.onlyLocals,
            },
          },
        },
        'postcss-loader'
      ],
    };
    if (!options.onlyLocals) {
      rule.use.unshift(devLoader)
    }
    if (map[extension]) {
      rule.use.push(map[extension]);
    }
    return rule;
  });
  return cssRules;
};

const vueLoaders = () => [{
  test: /\.vue$/,
  use: [
    cacheLoader('vue-loader'),
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
      include: includes,
      use: [cacheLoader('babel-loader'), 'babel-loader', 'vue-jsx-hot-loader'],
    },
    {
      test: /\.ts$/,
      include: includes,
      use: [
        cacheLoader('ts-loader'),
        'babel-loader',
        'vue-jsx-hot-loader',
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
        cacheLoader('ts-loader'),
        'babel-loader',
        'vue-jsx-hot-loader',
        {
          loader: 'ts-loader',
          options: {
            appendTsxSuffixTo: [/\.vue$/],
          },
        },
      ],
    },
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

const staticLoaders = () => [{
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 1000,
        name: utils.formatDistributionAssetsPath('img/[hash:32].[ext]'),
      },
    },
    {
      loader: 'image-webpack-loader',
      options: {
        disable: utils.isRun,
      },
    },
  ],
},
{
  test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 1000,
    name: utils.formatDistributionAssetsPath('media/[hash:32].[ext]'),
  },
},
{
  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 1000,
    name: utils.formatDistributionAssetsPath('fonts/[hash:32].[ext]'),
  },
}];

exports.styleLoaders = styleLoaders;
exports.vueLoaders = vueLoaders;
exports.scriptLoaders = scriptLoaders;
exports.eslintLoaders = eslintLoaders;
exports.staticLoaders = staticLoaders;
