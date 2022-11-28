/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const importResolverExtensions = [
  '.js',
  '.jsx',
  '.jx',
  '.ts',
  '.tsx',
  '.tx',
  '.vue',
];

const javascriptRules = {
  'no-new-func': 'off',
  'no-underscore-dangle': 'off',
  'unicorn/no-array-callback-reference': 'off',
  'unicorn/no-array-for-each': 'off',
  'unicorn/no-array-reduce': 'off',
  'unicorn/prefer-switch': 'off',
};

const typescriptRules = {
  ...javascriptRules,
};

const buildingToolsJavascriptRules = {
  camelcase: 'off',
  'id-match': 'off',
  'multiline-comment-style': 'off',
  'no-console': 'off',
  'no-sync': 'off',
  'no-underscore-dangle': 'off',
  'node/global-require': 'off',
  'node/no-unpublished-require': 'off',
  'unicorn/prefer-module': 'off',
};

const buildingToolsTypescriptRules = {
  ...buildingToolsJavascriptRules,
  '@typescript-eslint/naming-convention': 'off',
};

// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 6,
    ecmaFeatures: {
      modules: true,
      jsx: true,
      legacyDecorators: true,
    },
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: [
    'import',
    'json',
    'unicorn',
    'unused-imports',
    'vue',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: importResolverExtensions,
      },
      webpack: {
        config: 'webpack.config.js',
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.tx'],
    },
  },
  noInlineConfig: true,
  overrides: [
    // ----------------------
    //  json files
    // ----------------------
    {
      files: ['.json', '.*.json'],
      extends: ['lvmcn/json'],
    },
    // ----------------------
    //  building tools files
    // ----------------------
    {
      files: ['*.js', '.*.js'],
      excludedFiles: ['src/**', 'static/**'],
      extends: ['lvmcn/javascript/node'],
      rules: buildingToolsJavascriptRules,
    },
    {
      files: ['*.ts', '.*.ts', '*.tsx', '.*.tsx'],
      excludedFiles: ['src/**', 'static/**'],
      extends: ['lvmcn/typescript/node'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
          modules: true,
          jsx: true,
          legacyDecorators: true,
        },
        sourceType: 'module',
        project: './tsconfig.json',
      },
      rules: buildingToolsTypescriptRules,
    },
    // ----------------------
    //  project source files
    // ----------------------
    {
      files: ['src/**/*.js', 'src/**/*.jsx'],
      extends: ['lvmcn/javascript/vue'],
      rules: javascriptRules,
    },
    {
      files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.tx'],
      extends: ['lvmcn/typescript/vue'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
          modules: true,
          jsx: true,
          legacyDecorators: true,
        },
        sourceType: 'module',
        project: './tsconfig.json',
      },
      rules: typescriptRules,
    },
    // d.ts
    {
      files: ['src/**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'unicorn/prefer-export-from': 'off',
        'unused-imports/no-unused-imports-ts': 'off',
      },
    },
    // utils
    {
      files: ['src/utils/*.ts'],
      rules: {},
    },
    // utils logger
    {
      files: ['src/utils/logger.ts'],
      rules: { 'no-console': 'off' },
    },
    // types
    {
      files: [
        'src/**/types.ts',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    // services
    {
      files: [
        'src/services/**/*.ts',
        'src/services/**/*.tsx',
      ],
      rules: {
        'unicorn/filename-case': 'off',
        'unicorn/no-array-for-each': 'off',
        '@typescript-eslint/no-redeclare': 'off',
      },
    },
  ],
};
