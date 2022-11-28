/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const utils = require('./utils');

const cacheLoader = path => ({
  loader: 'cache-loader',
  options: { cacheDirectory: utils.fullPath(`./node_modules/.cache/cache-loader/${utils.isProd ? 'prod' : 'dev'}/${path}`) },
});

const threadLoader = {
  loader: 'thread-loader',
  options: {
    // there should be 1 cpu for the fork-ts-checker-webpack-plugin
    workers: require('os').cpus().length - 1,
    poolTimeout: utils.isRun ? Number.POSITIVE_INFINITY : 500,
  },
};

// Generate loaders for standalone style files
const styleLoaders = (options = {}) => {
  const map = {
    less: {
      loader: 'less-loader',
      options: { lessOptions: { javascriptEnabled: true } },
    },
    sass: 'sass-loader',
    scss: 'sass-loader',
    styl: 'stylus-loader',
    stylus: 'stylus-loader',
  };

  // 现在默认都提取就好了
  const devLoader = options.extract
    ? {
      loader: MiniCssExtractPlugin.loader,
    }
    : '';

  const cssRules = ['css', 'less', 'sass', 'scss'].map((extension) => {
    const srcPath = utils.fullPath('src/');
    const stylesPath = utils.fullPath('src/styles/');
    const rule = {
      test: new RegExp(`\\.${extension}$`, 'u'),
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: {
              auto: resourcePath =>
                resourcePath.startsWith(srcPath)
                && !resourcePath.startsWith(stylesPath),
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              exportOnlyLocals: options.onlyLocals,
            },
          },
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

const scriptLoaders = (options = {}) => {
  const srcIncludes = [
    utils.fullPath('src'),
  ];
  const vueLoader = {
    test: /\.vue$/u,
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
      },
    ],
  };
  const jsLoader = {
    include: srcIncludes,
    test: /\.m?jsx?$/u,
    use: [
      'babel-loader',
      'vue-jsx-hot-loader',
      threadLoader,
    ],
  };
  const tsLoader = {
    include: srcIncludes,
    test: /\.ts$/u,
    use: [
      'babel-loader',
      'vue-jsx-hot-loader',
      {
        loader: 'ts-loader',
        options: {
          happyPackMode: true,
          transpileOnly: true,
          appendTsSuffixTo: [/\.vue$/u],
        },
      },
      threadLoader,
    ],
  };
  const tsxLoader = {
    include: srcIncludes,
    test: /\.tsx$/u,
    use: [
      'babel-loader',
      'vue-jsx-hot-loader',
      {
        loader: 'ts-loader',
        options: {
          happyPackMode: true,
          transpileOnly: true,
          appendTsxSuffixTo: [/\.vue$/u],
        },
      },
      threadLoader,
    ],
  };
  // eslint has problems with cache loader
  // https://github.com/webpack-contrib/cache-loader/issues/72
  if (options.cache !== false) {
    jsLoader.use.unshift(cacheLoader('babel-loader'));
    tsLoader.use.unshift(cacheLoader('ts-loader'));
    tsxLoader.use.unshift(cacheLoader('tsx-loader'));
  }
  return [vueLoader, jsLoader, tsLoader, tsxLoader];
};

const assetsLoaders = () => [
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/u,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024,
      },
    },
    generator: {
      filename: 'assets/images/[contenthash][ext]',
    },
    use: [
      {
        loader: 'image-webpack-loader',
        options: {
          disable: utils.isRun,
        },
      },
    ],
  },
  {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/u,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024,
      },
    },
    generator: {
      filename: 'assets/media/[contenthash][ext]',
    },
  },
  {
    test: /\.(woff|eot|ttf|svg|gif)$/u,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024,
      },
    },
    generator: {
      filename: 'assets/fonts/[contenthash][ext]',
    },
  },
];

exports.styleLoaders = styleLoaders;
exports.scriptLoaders = scriptLoaders;
exports.assetsLoaders = assetsLoaders;
