/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import Option from '@/decorators/option';
import styles from './404.module.scss';

@Component
export default class GameSwitchPage extends Vue {
  @Option(true) protected static hideTabbar: void;

  public render(): VNode {
    return <div
      class={styles['a-404']}
    >
      <div class={styles['wrong-404-text']}>很抱歉，你访问的页面地址错误或已经失效</div>
      <div
        class={styles['wrong-404-btn']}
        onClick={() => this.$router.replace({ name: 'index' })}
      >返回首页</div>
    </div>;
  }
}
