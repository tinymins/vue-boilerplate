/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: "off" */

/**
 * 目标 action 类型
 */
type ActionType = 'reload' | 'refresh' | 'more' | '';

/**
 * 根据缓存情况 修正action类型 （'reload' | 'refresh' | 'more'）
 * @param {string} action 目标 action 类型
 * @param {boolean} cacheUsable 缓存是否可用
 * @param {boolean} noMore 瀑布流是否已无更多
 * @returns {string} 最终 action 类型
 */
export const finalizeAction = (action: ActionType, cacheUsable: any, noMore: any = false): ActionType => {
  if ((!action || action === 'more') && !cacheUsable) {
    action = 'reload';
  } else if ((action === 'refresh' && !cacheUsable) || (action === 'more' && noMore)) {
    action = '';
  }
  return action;
};
