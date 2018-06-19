/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2018-06-07 15:12:19
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
 */

export const popupWindow = (url, plugin) => {
  window.chrome.tabs.create({
    url: plugin ? window.chrome.extension.getURL(url) : url,
    selected: true,
  });
};
