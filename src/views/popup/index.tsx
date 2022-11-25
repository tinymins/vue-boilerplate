/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { type VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';

import { popupWindow } from '@/utils/chrome-ext';

import styles from './index.module.scss';

@Component
export default class PopupPage extends Vue {
  private ready = false;
  private timerRender = 0;

  private popupUser(): void {
    popupWindow('index.html#/user', true);
  }

  private startRender(): void {
    if (this.timerRender) {
      clearTimeout(this.timerRender);
      this.timerRender = 0;
    }
    this.ready = true;
    window.removeEventListener('resize', this.startRender);
  }

  protected mounted(): void {
    window.addEventListener('resize', this.startRender);
    this.timerRender = window.setTimeout(this.startRender, 50);
  }

  public render(): VNode {
    return <div class="menu">
      {
        this.ready
          ? <button onClick={this.popupUser} type="primary" class={styles['menu-item']}>User center</button>
          : null
      }
    </div>;
  }
}
