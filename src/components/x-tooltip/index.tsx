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
  color?: string;
  backgroundColor?: string;
}

@Component({ name: 'x-tooltip' })
export default class XButton extends VueComponent<XTooltipProps> {
  @Prop({ type: String, default: 'top' })
  private readonly position!: NonNullable<XTooltipProps['position']>;

  @Prop({ type: String, default: '' })
  private readonly text!: NonNullable<XTooltipProps['text']>;

  @Prop({ type: Boolean, default: false })
  private readonly arrow!: NonNullable<XTooltipProps['arrow']>;

  @Prop({ type: String, default: '' })
  private readonly color!: NonNullable<XTooltipProps['color']>;

  @Prop({ type: String, default: '' })
  private readonly backgroundColor!: NonNullable<XTooltipProps['backgroundColor']>;

  private get tooltipClass(): string[] {
    const tooltipClass = [styles['x-tooltip'], styles[`x-tooltip--${this.position}`]];
    if (this.arrow) {
      tooltipClass.push(styles.arrow);
    }
    return tooltipClass;
  }

  private get tooltipTextStyle(): Record<string, string> {
    const textStyles: Record<string, string> = {};
    if (this.color) {
      textStyles.color = this.color;
    }
    if (this.backgroundColor) {
      textStyles.backgroundColor = this.backgroundColor;
    }
    return textStyles;
  }

  private get tooltipArrowStyle(): Record<string, string> {
    const arrawStyles: Record<string, string> = {};
    if (this.arrow && this.backgroundColor) {
      arrawStyles[`border-${this.position}-color`] = this.backgroundColor;
    }
    return arrawStyles;
  }

  public render(): VNode {
    return <div class={this.tooltipClass}>
      { this.$slots.default }
      <div class={styles['x-tooltip-text']} style={this.tooltipTextStyle}>
        {
          this.arrow
            ? <div class={styles['x-tooltip-text__arrow']} style={this.tooltipArrowStyle}></div>
            : null
        }
        { this.text }
      </div>
    </div>;
  }
}
