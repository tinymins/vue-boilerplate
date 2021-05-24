/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { CreateElement, VNode } from 'vue';
import { namespace } from 'vuex-class';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { BasicUniqueObject } from '@/types';
import { StoreCommonBusState } from '@/store/common/bus';
import Popup from '@/components/popup';
import Iconfont from '@/components/iconfont';
import XLoading from '@/components/x-loading';
import styles from './index.module.scss';

export interface ToastData extends BasicUniqueObject {
  text?: string;
  render?: (h: CreateElement) => VNode | VNode[] | undefined | null;
  time?: number;
  type?: 'info' | 'success' | 'warning' | 'error' | 'loading';
  position?: 'top' | 'center' | 'bottom';
  closeable?: boolean;
}

const commonBusModule = namespace('common/bus');

@Component
export default class ToastHandler extends Vue {
  @commonBusModule.State private readonly toasts!: StoreCommonBusState['toasts'];

  private timer = 0;
  private show = false;
  private toast: ToastData | null = null;
  private content?: string = '';

  @Watch('toasts')
  public onToastsChange(): void {
    this.updateToast();
  }

  private hideToast(): void {
    if (!this.show) {
      return;
    }
    this.timer = 0;
    if (!this.toast) {
      return;
    }
    this.$hideToast(this.toast);
  }

  private updateToast(): void {
    const toast = this.toasts.find(item => item.type !== 'loading') || this.toasts[0];
    const hasToast = !!toast;
    if (this.toast === toast && this.show === hasToast) {
      return;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }
    if (toast) {
      if (toast.time && toast.time > 0) {
        this.timer = window.setTimeout(this.hideToast, toast.time);
      }
      this.content = toast.type === 'loading'
        ? this.toasts.filter(p => p.type === 'loading').map(c => c.text).filter(_ => _).join(' | ')
        : toast.text;
      this.toast = toast;
    }
    this.show = hasToast;
  }

  public mounted(): void {
    this.updateToast();
  }

  private renderIcon(): VNode | null {
    if (this.toast) {
      if (this.toast.type === 'loading') {
        return <XLoading class={styles['toast-icon__loading']}></XLoading>;
      }
      if (this.toast.type === 'success') {
        return <Iconfont class={styles['toast-icon__fa']} icon="toast-success"></Iconfont>;
      }
      if (this.toast.type === 'warning' || this.toast.type === 'error') {
        return <Iconfont class={styles['toast-icon__fa']} icon="toast-warning"></Iconfont>;
      }
    }
    return null;
  }

  private renderContent(h, toast: ToastData): VNode | VNode[] | null | undefined {
    if (toast.render) {
      return toast.render(h);
    }
    if (this.content) {
      return this.content.split('\n').map(s => <p>{s}</p>);
    }
    return null;
  }

  protected render(h): VNode | null {
    if (!this.toast) {
      return null;
    }
    return <Popup
      value={this.show}
      position="center"
      maskClosable={this.toast.closeable}
      on={{ input: e => !e && this.hideToast() }}
    >
      <div class={{
        [styles.toast]: true,
        [styles['toast--flex']]: this.toast.type !== 'success' && this.toast.type !== 'warning' && this.toast.type !== 'error',
      }}>
        <div class={styles['toast-icon']}>
          { this.renderIcon() }
        </div>
        <div class={styles['toast-content']}>
          <div class={styles['toast-content__text']}>
            { this.renderContent(h, this.toast) }
          </div>
        </div>
      </div>
    </Popup>;
  }
}
