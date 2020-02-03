/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

window.addEventListener('error', function(e) {
  var base = '/api/submit-exception?source=';
  var iframe = document.createElement('iframe');
  if (typeof e === 'object') {
    var source = encodeURIComponent(String(e.filename) + ':' + String(e.lineno) + ',' + String(e.colno));
    var origin = encodeURIComponent(String(window.location.href));
    var message = encodeURIComponent(String(e.message));
    iframe.src = base + source + '&origin=' + origin + '&message=' + message + '&_=' + new Date().valueOf();
  } else {
    iframe.src = base + String(e);
  }
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
});
