/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
 */

export const popupWindow = (url, plugin) => {
  window.chrome.tabs.create({
    url: plugin ? window.chrome.extension.getURL(url) : url,
    selected: true,
  });
};
