/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

module.exports = {
  proxy: {
    '/api': {
      target: 'https://dev.haimanchajian.com',
      pathRewrite: {
        '^/api': '/api',
      },
      changeOrigin: true,
    },
  },
  autoOpenBrowser: false,
};
