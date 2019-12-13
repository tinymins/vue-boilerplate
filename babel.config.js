/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      // useBuiltIns: 'entry',
      corejs: 3,
    }],
    '@babel/preset-typescript',
    '@vue/babel-preset-jsx',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    ['component', {
      libraryName: 'element-ui',
      styleLibraryName: 'theme-chalk',
    }],
  ],
};
