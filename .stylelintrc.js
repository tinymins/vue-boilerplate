/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

module.exports = {
  "extends": "stylelint-config-standard",
  "plugins": [
  //   "stylelint-no-unsupported-browser-features",
  ],
  "rules": {
    "at-rule-empty-line-before": ["always", {
      except: ["inside-block", "blockless-after-same-name-blockless", "first-nested"],
      ignore: ["blockless-after-blockless"],
      ignoreAtRules: ["array", "of", "at-rules", "at-root"],
    }],
    "at-rule-no-unknown": null,
    "color-hex-length": "long",
    "comment-empty-line-before": ["always", {
      ignore: ["after-comment", "stylelint-commands"],
    }],
    "max-nesting-depth": null,
    "no-empty-source": null,
    "no-descending-specificity": null,
    "number-leading-zero": "never",
    // "plugin/no-unsupported-browser-features": true,
    "selector-class-pattern": [
      // Matches class name likes this: block__elem--mod or block1__elem1--mod1-block2__elem2--mod2-...
      /^(?:weui-[a-z-_]+|(?:(?:(?:^|(?!^)-)[a-z]+\d*|-[a-z]*\d+)(?:__[a-z]+\d*|__[a-z]*\d+){0,1}(?:--[a-z]+\d*|--[a-z]*\d+){0,1})*)$/, {
        "severity": "error",
        "resolveNestedSelectors": true,
        "message": "Selector should be written in BEM style (selector-class-pattern)",
      },
    ],
    "selector-id-pattern": /^\$[a-z][a-zA-Z0-9_]$/,
    "selector-max-compound-selectors": null,
    "selector-no-qualifying-type": null,
  },
};
