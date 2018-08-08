// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  env: {
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended', // or 'plugin:vue/base'
    'airbnb-base',
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    },
  },
  // add your custom rules here
  'rules': {
    // eslint rules
    'camelcase': ['error', {
      'properties': 'always'
    }],
    'function-paren-newline': ['error', 'consistent'],
    'id-match': ['error', '^(?:\\${0,1}[a-zA-Z0-9]*||[A-Z_0-9]+)$', {
      'properties': true,
      'propertiesPattern': '^(?:\\${0,1}[a-z]+[a-zA-Z0-9]*||[A-Z_0-9]+)$',
      'onlyDeclarations': true,
      'errorMessage': 'Identifier \'{{name}}\' in not in lower camelcase.',
    }],
    'implicit-arrow-linebreak': 'off',
    'max-len': ['error', {
      'code': 140,
      'ignoreTrailingComments': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreUrls': true,
      'ignoreComments': true
    }],
    'no-underscore-dangle': 0,
    'no-restricted-imports': ['error', {
      'paths': ['lodash'],
    }],
    'no-return-assign': 0,
    'object-curly-newline': ['error', {
      'consistent': true
    }],
    'one-var': ['error', {
      'initialized': 'never',
    }],
    'one-var-declaration-per-line': ['error', 'initializations'],
    'prefer-destructuring': 0,
    'no-debugger': 'error',
    'no-console': 'error',
    'no-unused-vars': 'error',

    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // 'import/no-cycle': ['error', { maxDepth: 1 }],
    'import/no-cycle': 'off',
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow single export
    'import/prefer-default-export': 'off',

    // vue lint configs
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/attributes-order': 'off',
    // 'vue/attributes-order': [2, {
    //   order: [
    //     'DEFINITION',
    //     'LIST_RENDERING',
    //     'CONDITIONALS',
    //     'RENDER_MODIFIERS',
    //     'GLOBAL',
    //     'UNIQUE',
    //     ['BINDING', 'OTHER_ATTR'],
    //     'EVENTS',
    //     'CONTENT',
    //   ],
    // }],
    'vue/html-end-tags': 'error',
    'vue/html-indent': ['error', 2, {
      'attribute': 1,
      'closeBracket': 0,
      'ignores': []
    }],
    'vue/html-quotes': ['error', 'double'],
    'vue/html-self-closing': ['error', {
      'html': {
        'normal': 'never',
        'void': 'never',
        'component': 'never'
      },
      'svg': 'always',
      'math': 'always',
    }],
    'vue/max-attributes-per-line': [2, {
      'singleline': 10,
      'multiline': {
        'max': 2,
        'allowFirstLine': false
      },
    }],
    'vue/mustache-interpolation-spacing': ['error', 'always'],
    'vue/name-property-casing': ['error', 'kebab-case'],
    'vue/no-async-in-computed-properties': 'error',
    'vue/no-confusing-v-for-v-if': 'error',
    'vue/no-dupe-keys': 'error',
    'vue/no-duplicate-attributes': ['error', {
      allowCoexistClass: true,
      allowCoexistStyle: true,
    }],
    'vue/no-multi-spaces': 'error',
    'vue/no-parsing-error': 'error',
    'vue/no-reserved-keys': ['error', {
      'reserved': ['$el', '$nextTick', '$route', '$router', 'asyncData'],
      'groups': [],
    }],
    'vue/no-shared-component-data': 'error',
    'vue/no-side-effects-in-computed-properties': 'error',
    'vue/no-template-key': 'error',
    'vue/no-textarea-mustache': 'error',
    'vue/no-v-html': 'off',
    'vue/order-in-components': 'warn',
    // 'vue/order-in-components': ['error', {
    //   'order': [
    //     ['name', 'delimiters', 'functional', 'model'],
    //     ['components', 'directives', 'filters'],
    //     ['parent', 'mixins', 'extends', 'provide', 'inject'],
    //     'el',
    //     'template',
    //     'props',
    //     'propsData',
    //     'data',
    //     'computed',
    //     'watch',
    //     'asyncData',
    //     'onWechatReady',
    //     'LIFECYCLE_HOOKS',
    //     'methods',
    //     'render',
    //     'renderError'
    //   ],
    // }],
    'vue/require-component-is': 'error',
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    'vue/require-render-return': 'error',
    'vue/require-v-for-key': 'error',
    'vue/require-valid-default-prop': 'error',
    'vue/return-in-computed-property': 'error',
    'vue/this-in-template': ['error', 'never'],
    'vue/v-bind-style': ['error', 'shorthand'],
    'vue/v-on-style': ['error', 'shorthand'],
    'vue/valid-template-root': 'error',
    'vue/valid-v-bind': 'error',
    'vue/valid-v-cloak': 'error',
    'vue/valid-v-else-if': 'error',
    'vue/valid-v-else': 'error',
    'vue/valid-v-for': 'error',
    'vue/valid-v-html': 'error',
    'vue/valid-v-if': 'error',
    'vue/valid-v-model': 'error',
    'vue/valid-v-on': 'error',
    'vue/valid-v-once': 'error',
    'vue/valid-v-pre': 'error',
    'vue/valid-v-show': 'error',
    'vue/valid-v-text': 'error',
  }
}
