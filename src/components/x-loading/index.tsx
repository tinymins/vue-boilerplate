/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { type VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

import VueComponent from '@/components/vue-component';

import styles from './index.module.scss';

export type XLoadingTheme = 'spinner' | 'ripple' | 'ellipsis' | 'ring' | 'dual-ring' | 'roller';

export interface XLoadingProps {
  theme?: XLoadingTheme;
  color?: string;
  period?: number;
}

@Component({ name: 'x-loading' })
export default class XLoading extends VueComponent<XLoadingProps> {
  @Prop({ type: String, default: 'spinner' })
  private readonly theme!: NonNullable<XLoadingProps['theme']>;

  @Prop({ type: String, default: '#333333' })
  private readonly color!: NonNullable<XLoadingProps['color']>;

  @Prop({ type: Number, default: 1200 })
  private readonly period!: NonNullable<XLoadingProps['period']>;

  private timer = 0;
  private size = 0;

  @Watch('theme')
  public onThemeChange(): void {
    this.$nextTick(this.updateSize);
  }

  private updateSize(): void {
    const $el = this.$el as HTMLDivElement;
    this.size = $el ? $el.getBoundingClientRect().width : 0;
  }

  public mounted(): void {
    this.updateSize();
    this.$nextTick(this.updateSize);
    this.timer = window.setInterval(this.updateSize, 100); // TODO: 初始化时候DOM大小永远不对不知道为什么
    window.addEventListener('resize', this.updateSize);
  }

  public beforeDestroy(): void {
    clearInterval(this.timer);
    window.removeEventListener('resize', this.updateSize);
  }

  private renderSpinner(): VNode {
    return <div class={styles['lds-spinner']} style={{ color: this.color }}>
      {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => <div
          style={{
            transform: `rotate(${i * 30}deg)`,
            'animation-duration': `${this.period}ms`,
            'animation-delay': `${(this.period * -1 * (11 - i)) / 12}ms`,
          }}
        >
          <div style={{ background: this.color }}></div>
        </div>)
      }
    </div>;
  }

  private renderRipple(): VNode {
    const style = { 'border-color': this.color, 'border-width': `${this.size * 0.2}px` };
    return <div class={styles['lds-ripple']}>
      <div style={style}></div>
      <div style={style}></div>
    </div>;
  }

  private renderEllipsis(): VNode {
    const style = { background: this.color };
    return <div class={styles['lds-ellipsis']}>
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
    </div>;
  }

  private renderRing(): VNode {
    const size = 0.1;
    const blank = 1 - size * 2;
    const style = {
      width: `${this.size * blank}px`,
      height: `${this.size * blank}px`,
      'border-width': `${this.size * size}px`,
      'border-top-color': this.color,
    };
    return <div class={styles['lds-ring']}>
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
    </div>;
  }

  private renderDualRing(): VNode {
    const size = 0.1;
    const blank = 1 - size * 2;
    const style = {
      width: `${this.size * blank}px`,
      height: `${this.size * blank}px`,
      'border-width': `${this.size * size}px`,
      'border-top-color': this.color,
      'border-bottom-color': this.color,
    };
    return <div class={styles['lds-dual-ring']}>
      <div style={style}></div>
    </div>;
  }

  private renderRoller(): VNode {
    const size = this.size;
    const radius = size * 0.5;
    const ballSize = size * 0.08;
    const dAngle = (15 / 180) * Math.PI;
    const oAangle = (90 / 180) * Math.PI - dAngle * 8 * 0.5;
    return <div class={styles['lds-roller']}>
      {
        [1, 2, 3, 4, 5, 6, 7, 8].map(i => <div style={{ 'animation-delay': `${-0.03 * i * this.period}ms` }}>
          <div
            style={{
              margin: `${ballSize * -0.5}px 0 0 ${ballSize * -0.5}px`,
              width: `${ballSize}px`,
              height: `${ballSize}px`,
              top: `${Math.sin(oAangle + dAngle * i) * radius + size * 0.5}px`,
              left: `${Math.cos(oAangle + dAngle * i) * radius + size * 0.5}px`,
              background: this.color,
            }}
          ></div>
        </div>)
      }
    </div>;
  }

  public render(): VNode | null {
    if (this.theme === 'spinner') {
      return this.renderSpinner();
    }
    if (this.theme === 'ripple') {
      return this.renderRipple();
    }
    if (this.theme === 'ellipsis') {
      return this.renderEllipsis();
    }
    if (this.theme === 'ring') {
      return this.renderRing();
    }
    if (this.theme === 'dual-ring') {
      return this.renderDualRing();
    }
    if (this.theme === 'roller') {
      return this.renderRoller();
    }
    return null;
  }
}
