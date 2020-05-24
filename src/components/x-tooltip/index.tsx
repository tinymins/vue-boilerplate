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

export interface XTooltipProps {
  position?: 'top' | 'left' | 'right' | 'bottom';
  text?: string;
  arrow?: boolean;
}

@Component({ name: 'x-tooltip' })
export default class XButton extends VueComponent<XTooltipProps> {
  @Prop({ type: String, default: 'top' })
  private readonly position!: NonNullable<XTooltipProps['position']>;

  @Prop({ type: String, default: '' })
  private readonly text!: NonNullable<XTooltipProps['text']>;

  @Prop({ type: Boolean, default: false })
  private readonly arrow!: NonNullable<XTooltipProps['arrow']>;

  private get tooltipClass(): string[] {
    const tooltipClass = [styles['x-tooltip'], styles[`x-tooltip--${this.position}`]];
    if (this.arrow) {
      tooltipClass.push(styles.arrow);
    }
    return tooltipClass;
  }

  public render(): VNode {
    return <div class={this.tooltipClass}>
      { this.$slots.default }
      <div class={styles['x-tooltip-text']}>
        { this.text }
      </div>
    </div>;
  }
}
