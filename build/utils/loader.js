/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const utils = require('.');

const cacheLoader = path => ({
  loader: 'cache-loader',
  options: { cacheDirectory: utils.fullPath(`./node_modules/.cache/cache-loader/${utils.isProd ? 'prod' : 'dev'}/${path}`) },
});

const threadLoader = {
  loader: 'thread-loader',
  options: {
    // there should be 1 cpu for the fork-ts-checker-webpack-plugin
    workers: require('os').cpus().length - 1,
    poolTimeout: utils.isRun ? Infinity : 500,
  },
};

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
        {
          loader: 'css-loader',
          options: {
            modules: {
              auto: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              exportOnlyLocals: options.onlyLocals,
            },
          }
        },
        'postcss-loader',
      ],
    };
    if (options.cache !== false) {
      rule.use.unshift(cacheLoader(`${extension}-loader`));
    }
    if (!options.onlyLocals) {
      rule.use.unshift(devLoader);
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

const scriptLoaders = (options = {}) => {
  const srcIncludes = [
    utils.fullPath('config'),
    utils.fullPath('src'),
    utils.fullPath('test'),
  ];
  const jsLoader = {
    include: srcIncludes,
    test: /\.m?jsx?$/,
    use: [
      'babel-loader',
      'vue-jsx-hot-loader',
      threadLoader,
    ],
  };
  const tsLoader = {
    include: srcIncludes,
    test: /\.ts$/,
    use: [
      'babel-loader',
      'vue-jsx-hot-loader',
      threadLoader,
      {
        loader: 'ts-loader',
        options: {
          happyPackMode: true,
          transpileOnly: true,
          appendTsSuffixTo: [/\.vue$/],
        },
      },
    ],
  };
  const tsxLoader = {
    include: srcIncludes,
    test: /\.tsx$/,
    use: [
      'babel-loader',
      'vue-jsx-hot-loader',
      threadLoader,
      {
        loader: 'ts-loader',
        options: {
          happyPackMode: true,
          transpileOnly: true,
          appendTsxSuffixTo: [/\.vue$/],
        },
      },
    ],
  };
  // eslint has problems with cache loader
  // https://github.com/webpack-contrib/cache-loader/issues/72
  if (options.cache !== false) {
    jsLoader.use.unshift(cacheLoader('babel-loader'));
    tsLoader.use.unshift(cacheLoader('ts-loader'));
    tsxLoader.use.unshift(cacheLoader('tsx-loader'));
  }
  return [jsLoader, tsLoader, tsxLoader];
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
    formatter: require('eslint-friendly-formatter'),
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
