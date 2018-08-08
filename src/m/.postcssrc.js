// https://github.com/michael-ciniawsky/postcss-load-config
const merge = require('webpack-merge');
const parent = require('../../.postcssrc');

module.exports = merge(parent, {
  "plugins": {
    // see https://www.npmjs.com/package/postcss-px2rem
    "postcss-px2rem": {
      remUnit: 75,
    },
    // "postcss-px-to-viewport": {
    //   "viewportWidth": 750,
    //   "viewportHeight": 1334,
    //   "unitPrecision": 5,
    //   "viewportUnit": "vw",
    //   "selectorBlackList": [],
    //   "minPixelValue": 1,
    //   "mediaQuery": false,
    // },
  }
})
