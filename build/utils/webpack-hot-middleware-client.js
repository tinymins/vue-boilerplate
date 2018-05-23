/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-21 14:38:28
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2017-11-23 14:19:21
 * @Desc: This file will be loaded directly by browser,
 *        so DO NOT use es6 features for compatibility.
 */
/* eslint-disable */
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true');

var onSubscribe = function (event) {
  if (event.action === 'reload') {
    window.location.reload();
  }
};
hotClient.subscribe(onSubscribe);
