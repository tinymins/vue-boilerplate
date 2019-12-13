/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
module.exports = {
  "extends": "stylelint-config-sass-guidelines",
  "plugins": [
  //   "stylelint-no-unsupported-browser-features",
  ],
  "rules": {
    // "at-rule-empty-line-before": ["always", {
    //   except: ["after-same-name", "inside-block"],
    // }],
    "color-hex-length": "long",
    "max-nesting-depth": null,
    "no-empty-source": null,
    "number-leading-zero": "never",
    "order/properties-alphabetical-order": null,
    "order/properties-order": [
      // Position and size
      "position",
      "z-index",
      "float",
      "clear",
      "top",
      "right",
      "bottom",
      "left",
      "width",
      "height",
      "min-width",
      "max-width",
      "min-height",
      "max-height",
      // Margin and padding
      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      // Layout control
      "box-sizing",
      "display",
      "content",
      "flex",
      "flex-direction",
      "flex-grow",
      "flex-shrink",
      "flex-basis",
      "flex-wrap",
      "justify-content",
      "align-items",
      // Overflow control
      "overflow",
      "overflow-x",
      "overflow-y",
      // Detail props and appearances
      "appearance",
      "list-style-type",
      "resize",
      "opacity",
      "cursor",
      "font-family",
      "font-size",
      "font-weight",
      "letter-spacing",
      "line-height",
      "text-decoration",
      "text-size-adjust",
      "text-shadow",
      "text-align",
      "vertical-align",
      "word-break",
      "word-wrap",
      "white-space",
      "text-overflow",
      // Color and background control
      "color",
      "fill",
      "text-fill-color", // -webkit
      "tap-highlight-color", // -webkit
      "background",
      "background-color",
      "background-image",
      "background-position",
      "background-size",
      "background-repeat",
      "background-clip",
      "box-shadow",
      "backdrop-filter",
      // Outline and border
      "outline",
      "border",
      "border-top",
      "border-right",
      "border-bottom",
      "border-left",
      "border-width",
      "border-top-width",
      "border-right-width",
      "border-bottom-width",
      "border-left-width",
      "border-style",
      "border-top-style",
      "border-right-style",
      "border-bottom-style",
      "border-left-style",
      "border-color",
      "border-top-color",
      "border-right-color",
      "border-bottom-color",
      "border-left-color",
      "border-radius",
      "border-top-right-radius",
      "border-bottom-right-radius",
      "border-bottom-left-radius",
      "border-top-left-radius",
      // Etc.
      "animation",
      "animation-delay",
      "animation-timing-function",
      "transform",
      "transform-origin",
      "user-select",
      "pointer-events",
      "box-orient", // -webkit
      "line-clamp", // -webkit
      "touch-callout", // -webkit
      "overflow-scrolling", // -webkit
    ],
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
  }
}
