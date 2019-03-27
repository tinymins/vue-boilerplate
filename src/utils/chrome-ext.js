/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

export const popupWindow = (url, plugin) => {
  if (window.chrome) {
    window.chrome.tabs.create({
      url: plugin ? window.chrome.extension.getURL(url) : url,
      selected: true,
    });
  }
};

export const getSelection = () => new Promise((resolve, reject) => {
  if (window.chrome) {
    try {
      window.chrome.tabs.executeScript({
        code: 'window.getSelection().toString();',
      }, (selection) => {
        resolve(selection[0]);
      });
    } catch (e) {
      reject(e);
    }
  } else {
    reject();
  }
});
