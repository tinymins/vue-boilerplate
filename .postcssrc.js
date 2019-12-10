// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  'plugins': {
    'postcss-import': {},
    'postcss-preset-env': {},
    // to edit target browsers: use "browserslist" field in package.json
    'autoprefixer': {},
    // see https://www.npmjs.com/package/postcss-px2rem
    'postcss-px2rem': { remUnit: 75 },
    // 'postcss-px-to-viewport': {
    //   'viewportWidth': 750,
    //   'viewportHeight': 1334,
    //   'unitPrecision': 5,
    //   'viewportUnit': 'vw',
    //   'selectorBlackList': [],
    //   'minPixelValue': 1,
    //   'mediaQuery': false,
    // },
    'postcss-reporter': { clearReportedMessages: true },
  },
};
