/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { StoreRootState } from '.';

/**
 * 目标 action 类型
 */
export type ActionType = 'reload' | 'refresh' | 'more' | '';

export interface StoreActionEnv<T = unknown> {
  state: T;
  rootState: StoreRootState;
  commit: (key: string, val?: unknown, options?: { root?: boolean }) => void;
  dispatch: (key: string, val?: unknown, options?: { root?: boolean }) => Promise<void>;
}

/**
 * 根据缓存情况 修正action类型 （'reload' | 'refresh' | 'more'）
 * reload : 表示无论如何都需要刷新缓存数据 （例如首页列表下拉强制刷新）
 * refresh: 表示仅当缓存存在时才需要刷新缓存数据 （例如用户修改个人资料后需要刷新本地的个人资料数据缓存）
 * more   : 表示瀑布流加载更多数据 （例如帖子列表上滑加载）
 * @param {string} action 目标 action 类型
 * @param {boolean} cacheUsable 缓存是否可用
 * @param {boolean} noMore 瀑布流是否已无更多
 * @returns {string} 最终 action 类型
 */
export const finalizeAction = (action: ActionType, cacheUsable: unknown, noMore: unknown = false): ActionType => {
  if ((!action || action === 'more') && !cacheUsable) {
    action = 'reload';
  } else if ((action === 'refresh' && !cacheUsable) || (action === 'more' && noMore)) {
    action = '';
  }
  return action;
};
