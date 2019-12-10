/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class IndexPage extends Vue {
  private showToast(): void {
    this.$showToast({ text: '01234' });
    this.$showToast({ text: '56789' });
    const id = this.$showToast({ text: '66789' });
    this.$showToast({ text: 'ABCDE' });
    this.$hideToast({ id });
  }

  private showDialog(): void {
    this.$showDialog({
      type: 'confirm',
      title: '确定？',
      content: '？',
      buttons: [
        { label: '嗯。', primary: true, action: () => {} },
      ],
    });
    this.$showDialog({ type: 'alert', content: '懂？' });
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
    return <div>
      <div>index</div>
      <br/><button onClick={this.showToast}>弹三个Toast</button>
      <br/><button onClick={this.showDialog}>弹两个Dialog</button>
      <br/><button onClick={this.showLoading}>弹五秒Loading</button>
      <br/><button onClick={this.showActionsheet}>弹三个Actionsheet</button>
      <br/><br/><router-link to={{ name: 'popup' }}>popup</router-link>
    </div>;
  }
}
