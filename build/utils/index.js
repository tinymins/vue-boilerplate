/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-21 15:30:28
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2017-11-24 11:31:26
 */
/* eslint-disable id-match */
/* eslint-disable no-console */

const path = require('path');
const config = require('../../config');

const isProd = process.env.NODE_ENV === 'production';
const chalk = require('chalk');
const shell = require('shelljs');
const semver = require('semver');
const childProcess = require('child_process');
const autoPrefixer = require('autoprefixer');
const postcssPx2Rem = require('postcss-px2rem');
const packageConfig = require('../../package.json');
const extractTextPlugin = require('extract-text-webpack-plugin');

const fullPath = s => path.join(__dirname, '..', '..', s);
const assetsPath = s => path.posix.join(config.assetsSubDirectory, s || '');
const regexEscape = s => s.replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, '\\$&');
const mobileBasePath = regexEscape(fullPath('src/m/'));


const cssLoaders = (options = {}, px2rem = true) => {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: isProd,
      sourceMap: options.sourceMap,
    },
  };
  const px2remLoader = {
    loader: 'px2rem-loader',
    options: config.px2rem,
  };
  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = [cssLoader];
    if (px2rem) {
      loaders.push(px2remLoader);
    }
    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
        }),
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
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
  };
};

// Generate loaders for standalone style files (outside of .vue)
const styleLoaders = (options) => {
  const output = [];
  let loaders = cssLoaders(options, true); // mobile version use px2rem
  Object.keys(loaders).forEach((extension) => {
    output.push({
      test: new RegExp(`^${mobileBasePath}.*\\.${regexEscape(extension)}$`),
      use: loaders[extension],
    });
  });
  loaders = cssLoaders(options, false); // pc version disable px2rem
  Object.keys(loaders).forEach((extension) => {
    output.push({
      test: new RegExp(`^(?!${mobileBasePath}).*\\.${regexEscape(extension)}$`),
      use: loaders[extension],
    });
  });
  return output;
};

const vueLoaders = () => {
  const geneVueLoaderConfig = (px2rem) => {
    const output = {
      loaders: cssLoaders({
        sourceMap: config.sourceMap,
        extract: isProd,
      }, px2rem),
      transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href',
      },
      postcss: [
        autoPrefixer({
          browsers: ['last 10 versions'],
        }),
      ],
    };
    if (px2rem) {
      output.postcss.push(
        postcssPx2Rem(config.px2rem),
      );
    }
    return output;
  };
  const output = [];
  output.push({ // mobile version use px2rem
    test: new RegExp(`^${mobileBasePath}.*\\.vue$`),
    loader: 'vue-loader',
    options: geneVueLoaderConfig(true),
  });
  output.push({ // pc version disable px2rem
    test: new RegExp(`^(?!${mobileBasePath}).*\\.vue$`),
    loader: 'vue-loader',
    options: geneVueLoaderConfig(false),
  });
  return output;
};

const checkVersions = () => {
  function exec(cmd) {
    return childProcess.execSync(cmd).toString().trim();
  }

  const versionRequirements = [
    {
      name: 'node',
      currentVersion: semver.clean(process.version),
      versionRequirement: packageConfig.engines.node,
    },
  ];

  if (shell.which('npm')) {
    versionRequirements.push({
      name: 'npm',
      currentVersion: exec('npm --version'),
      versionRequirement: packageConfig.engines.npm,
    });
  }

  const warnings = [];
  versionRequirements.forEach((mod) => {
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(`${mod.name}: ${
        chalk.red(mod.currentVersion)} should be ${
        chalk.green(mod.versionRequirement)}`);
    }
  });

  if (warnings.length) {
    console.log('');
    console.log(chalk.yellow('To use this template, you must update following to modules:'));
    console.log();
    warnings.forEach((warning) => {
      console.log(`  ${warning}`);
    });
    console.log();
    process.exit(1);
  }
};

exports.fullPath = fullPath;
exports.assetsPath = assetsPath;
exports.cssLoaders = cssLoaders;
exports.styleLoaders = styleLoaders;
exports.vueLoaders = vueLoaders;
exports.checkVersions = checkVersions;
