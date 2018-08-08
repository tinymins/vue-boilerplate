module.exports = {
  "extends": "stylelint-config-standard",
  "rules": {
    "at-rule-no-unknown": [true, {
      "ignoreAtRules": ["function", "if", "at-root", "each", "include", "mixin"]
    }],
    "no-empty-source": null,
    "number-leading-zero": "never",
    "selector-class-pattern": [
      // Matches class name likes this: block__elem--mod or block1__elem1--mod1-block2__elem2--mod2-...
      /^(?:weui-[a-z-_]+|(?:(?:(?:^|(?!^)-)[a-z]+\d*|-[a-z]*\d+)(?:__[a-z]+\d*|__[a-z]*\d+){0,1}(?:--[a-z]+\d*|--[a-z]*\d+){0,1})*)$/, {
        "severity": "error",
        "resolveNestedSelectors": true,
      },
    ],
    "selector-id-pattern": /^\$[a-z][a-zA-Z0-9_]$/,
    "unit-case": null,
  }
}
