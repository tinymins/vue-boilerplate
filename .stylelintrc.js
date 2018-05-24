module.exports = {
  "processors": [
    ["@mapbox/stylelint-processor-arbitrary-tags", {
      fileFilterRegex: [/\.vue$/, /\.html$/],
    }],
  ],
  "extends": "stylelint-config-standard",
  "rules": {
    "no-empty-source": null,
    "number-leading-zero": "never",
    "selector-class-pattern": [
      "^(?:weui-[a-z]+_[a-z\\-]+|[a-z]+[0-9]*(?:\\-[a-z]+[0-9]*|\\-[a-z]*[0-9]+)*(?:__[a-z]+){0,1})$", {
        "severity": "error",
        "resolveNestedSelectors": true,
      },
    ],
    "unit-case": null,
  }
}
