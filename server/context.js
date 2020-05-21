/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

module.exports = req => ({
  title: '默认标题', // 这是默认标题，需要去代码中修改的。
  keywords: 'keywords',
  description: 'description',
  url: req.url,
  request: {
    headers: req.headers,
    protocol: req.protocol,
    ip: req.ip,
    hostname: req.hostname,
  },
});
