/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import XTooltip from '@/components/x-tooltip';
import styles from '@/styles/views/index/index.module.scss';

@Component
export default class IndexPage extends Vue {
  private showToast(): void {
    this.$showToast({ text: '01234' });
    this.$showToast({ type: 'warning', text: '56789' });
    this.$showToast({ text: '这是一个超级长的提示'.repeat(10) });
    const id = this.$showToast({ text: '66789' });
    this.$showToast({ type: 'success', text: 'ABCDE' });
    this.$hideToast({ id });
  }

  private showDialog(): void {
    this.$showDialog({
      type: 'confirm',
      title: '确定？',
      content: '？',
      buttons: [
        {
          label: '嗯。',
          primary: true,
          action: () => {
            this.$hideDialog({ id: 'dialog1' });
          },
        },
      ],
    });
    this.$showDialog({ id: 'dialog1', type: 'alert', content: '懂？' });
  }

  private showLoading(): void {
    const id = this.$showLoading({ text: '5秒' });
    setTimeout(() => this.$hideLoading({ id }), 5000);
  }

  private showActionsheet(): void {
    this.$showActionsheet({
      title: '第一个',
      data: [
        { id: 'op1', label: '撤销错误的' },
        { id: 'op2', label: '不撤销了吧' },
      ],
      handler: ({ id }) => {
        if (id === 'op1') {
          this.$hideActionsheet({ id: 'actionsheet1' });
        }
        this.$showActionsheet({
          title: '第三个',
          data: [{ id: 'op1', label: '选项一' }],
          handler: () => {},
        });
      },
      oncancel: () => {
        this.$hideActionsheet({ id: 'actionsheet1' });
      },
    });
    this.$showActionsheet({
      id: 'actionsheet1',
      title: '不应该有这个',
      data: [{ id: 'op1', label: '选项一' }],
      handler: () => {},
    });
    this.$showActionsheet({
      title: '第二个',
      data: [{ id: 'op1', label: '选项一' }],
      handler: () => {},
    });
  }

  public render(): VNode {
    return <div class={styles.main}>
      <div class={styles.title}>基础组件测试</div>
      <div class={styles.content}>
        <ul class={styles.buttons}>
          <li>
            <XTooltip position="right" text="弹三个Toast" arrow>
              <button onClick={this.showToast}>弹三个Toast</button>
            </XTooltip>
          </li>
          <li>
            <XTooltip position="top" text="弹两个Dialog" arrow backgroundColor="#17a287">
              <button onClick={this.showDialog}>弹两个Dialog</button>
            </XTooltip>
          </li>
          <li>
            <XTooltip position="bottom" text="弹五秒Loading" arrow backgroundColor="#17a287">
              <button onClick={this.showLoading}>弹五秒Loading</button>
            </XTooltip>
          </li>
          <li>
            <XTooltip position="left" text="弹三个Actionsheet" arrow color="#555555" backgroundColor="#ffb1e7">
              <button onClick={this.showActionsheet}>弹三个Actionsheet</button>
            </XTooltip>
          </li>
        </ul>
      </div>
      <div class={styles.title}>页面链接</div>
      <div class={styles.content}>
        <div class={styles.links}>
          <p><router-link to={{ name: 'popup' }}>Popup</router-link></p>
          <p><router-link to={{ name: 'user_me' }}>Me</router-link></p>
          <p><router-link to={{ name: 'user_login' }}>Login</router-link></p>
          <p><router-link to={{ name: 'user_login_dev' }}>Login Dev</router-link></p>
        </div>
      </div>
    </div>;
  }
}
