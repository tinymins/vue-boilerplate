/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import VueComponent from '@/components/vue-component';
import styles from './index.module.scss';

export interface IconfontProps {
  base?: string;
  type?: 'i' | 'svg';
  icon: string;
}

@Component({ name: 'iconfont' })
export default class Iconfont extends VueComponent<IconfontProps> {
  @Prop({ type: String, default: 'fa' })
  public readonly base!: string;

  @Prop({ type: String, default: 'i', validator: v => ['i', 'svg'].includes(v) })
  public readonly type!: 'i' | 'svg';

  @Prop({ type: String, default: '' })
  public readonly icon!: string;

  private get fontClass(): string {
    return `${this.base}-${this.type}`;
  }

  private get iconClass(): string {
    return `${this.fontClass}-${this.icon}`;
  }

  public render(): VNode | null {
    if (this.type === 'svg') {
      return <svg class={[styles.svg, this.fontClass]} aria-hidden="true">
        <use xlinkHref={`#${this.iconClass}`} />
      </svg>;
    }
    if (this.type === 'i') {
      return <i class={[styles.i, this.fontClass, this.iconClass]}></i>;
    }
    return null;
  }
}
