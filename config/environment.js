/**
 * @Author: Emil Zhai
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
 */
const chromeExtension = false;

module.exports = {
  appPath: chromeExtension || process.env.NODE_ACTION === 'run' ? '/' : '/m/',
  chromeExtension: chromeExtension,
};
