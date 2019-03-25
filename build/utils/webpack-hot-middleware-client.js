/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 * @desc     : This file will be loaded directly by browser,
 *             so DO NOT use es6 features for compatibility.
 */
/* eslint-disable */

(function() {
  var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true');

  function onSubscribe(event) {
    if (event.action === 'reload') {
      window.location.reload();
    }
  };
  hotClient.subscribe(onSubscribe);
})();
