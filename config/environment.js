/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const chromeExtension = false;

module.exports = {
  appPath: chromeExtension || process.env.NODE_ACTION === 'run' ? '/' : '/m/',
  chromeExtension: chromeExtension,
};
