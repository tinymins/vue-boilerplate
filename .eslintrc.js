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
      }
    },
    {
      files: ["**/src/store/utils.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      }
    },
    {
      "files": [
        "**/src/services/**/*.ts",
        "**/src/services/**/*.tsx",
      ],
      "rules": {
        "camelcase": "off",
        "id-match": "off",
        "no-underscore-dangle": "off",
        "unicorn/filename-case": "off",
        "unicorn/no-array-for-each": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-redeclare": "off",
      }
    },
    {
      files: [
        "*.d.ts",
        "**/src/store/types.ts",
      ],
      rules: {
        "react/no-typos": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ]
}
