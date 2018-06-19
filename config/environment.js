/**
 * @Author: Emil Zhai
 * @Date:   2017-09-15 09:26:00
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
 */
const chromeExtension = false;

module.exports = {
  appPath: chromeExtension || process.env.NODE_ACTION === 'run' ? '/' : '/m/',
  chromeExtension: chromeExtension,
};
