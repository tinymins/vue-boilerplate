/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

export const popupWindow = (url: string, plugin: boolean): void => {
  const chrome = window.chrome;
  if (chrome) {
    chrome.tabs.create({
      url: plugin ? chrome.extension.getURL(url) : url,
      selected: true,
    });
  }
};

export const getSelection = (): Promise<string> => new Promise((resolve, reject) => {
  const chrome = window.chrome;
  if (chrome) {
    try {
      chrome.tabs.executeScript({
        code: 'window.getSelection().toString();',
      }, (selection) => {
        resolve(selection[0]);
      });
    } catch (error) {
      reject(error);
    }
  } else {
    reject();
  }
});
