const utils = require("./webpack/utils");

const rules = {
  "no-console": utils.isRun ? "warn" : "error",
  "no-debugger": utils.isRun ? "warn" : "error",
  "no-new-func": "off",
  "no-undefined": "error",
  "no-underscore-dangle": "off",
  "no-void": "off",
  "react/jsx-no-bind": "off",
  "react/prop-types": "off",
  "react/sort-comp": "off",
  "unicorn/no-array-callback-reference": "off",
  "unicorn/no-array-for-each": "off",
  "unicorn/no-array-reduce": "off",
  "unicorn/prefer-default-parameters": "off",
  "unicorn/prefer-switch": "off",
};

// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "babel-eslint",
    // ecmaVersion: 2018,
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "lvmcn/javascript/vue",
  ],
  plugins: [],
  settings: {
    "import/resolver": {
      "webpack": {
        "config": "webpack.config.js"
      },
    },
  },
  noInlineConfig: true,
  rules,
  // specific paths config overrides
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.tx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
          modules: true,
          jsx: true,
          legacyDecorators: true,
          experimentalObjectRestSpread: true,
        },
        sourceType: "module",
        project: "./tsconfig.json",
      },
      extends: [
        "lvmcn/typescript/vue",
      ],
      rules,
    },
    {
      files: ["**/src/types.ts"],
      rules: {
        "id-match": "off",
        "@typescript-eslint/generic-type-naming": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-type-alias": "off",
      }
    },
    {
      files: ["**/src/store/utils.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      }
    },
    {
      files: ["**/src/router/index.ts"],
      rules: {
        "no-underscore-dangle": "off",
        "@typescript-eslint/no-type-alias": "off",
      }
    },
    {
      files: ["**/src/api/driver/*.ts"],
      rules: {
        "no-await-in-loop": "off",
        "max-classes-per-file": "off",
        "no-async-promise-executor": "off",
        "@typescript-eslint/no-type-alias": "off",
        "@typescript-eslint/no-explicit-any": "off",
      }
    },
    {
      files: ["**/src/api/**/*.ts"],
      rules: {
        "id-match": "off",
        "camelcase": "off",
        "no-underscore-dangle": "off",
        "no-bitwise": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
      }
    },
    {
      files: [
        "**/src/decorators/*.ts",
        "**/src/utils/*.ts",
        "**/src/**/utils.ts",
        "**/src/api/**/*.ts",
        "**/src/store/**.ts",
        "**/src/store/**/*.ts",
      ],
      rules: {
        "no-param-reassign": "off",
        "@typescript-eslint/no-type-alias": "off",
        "@typescript-eslint/no-empty-interface": "off",
      }
    },
    {
      files: [
        "*.d.ts",
        "**/src/store/types.ts",
      ],
      rules: {
        "react/no-typos": "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ]
}
