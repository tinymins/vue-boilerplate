/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { VNode } from 'vue';
import { RawLocation } from 'vue-router';
import { Component, Prop } from 'vue-property-decorator';
import VueComponent from '@/components/vue-component';
import styles from './index.module.scss';

export interface XButtonProps {
  invert?: boolean;
  inline?: boolean;
  outline?: boolean;
  primary?: boolean;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  to?: string | number | RawLocation;
}

@Component({ name: 'x-button' })
export default class XButton extends VueComponent<XButtonProps> {
  @Prop({ type: Boolean, default: false })
  private readonly invert!: NonNullable<XButtonProps['invert']>;

  @Prop({ type: Boolean, default: false })
  private readonly inline!: NonNullable<XButtonProps['inline']>;

  @Prop({ type: Boolean, default: false })
  private readonly outline!: NonNullable<XButtonProps['outline']>;

  @Prop({ type: Boolean, default: false })
  private readonly primary!: NonNullable<XButtonProps['primary']>;

  @Prop({ type: Boolean, default: false })
  private readonly secondary!: NonNullable<XButtonProps['secondary']>;

  @Prop({ type: Boolean, default: false })
  private readonly danger!: NonNullable<XButtonProps['danger']>;

  @Prop({ type: Boolean, default: false })
  private readonly disabled!: NonNullable<XButtonProps['disabled']>;

  @Prop({ type: [String, Object], default: '' })
  private readonly to!: NonNullable<XButtonProps['to']>;

  private onClick(e: MouseEvent): void {
    if (this.to) {
      if (typeof this.to === 'number') {
        this.$router.go(this.to);
      } else {
        this.$router.push(this.to);
      }
    } else {
      this.$emit('click', e);
    }
  }

  private getClassName(state: string): string {
    return styles[`x-button--${state}${this.disabled ? '-disabled' : ''}`];
  }

  private get btnClass(): string[] {
    let style: string;
    if (this.primary) {
      style = 'primary';
    } else if (this.secondary) {
      style = 'secondary';
    } else if (this.danger) {
      style = 'danger';
    } else {
      style = 'general';
    }
    const btnClass = [styles['x-button']];
    if (this.inline) {
      btnClass.push(styles['x-button--inline']);
    }
    if (this.invert) {
      if (this.outline) {
        btnClass.push(
          this.getClassName('border'),
          this.getClassName(`border-${style}-bg`),
        );
      }
      btnClass.push(this.getClassName(`foreground-${style}-bg`));
    } else {
      if (this.outline) {
        btnClass.push(
          this.getClassName('border'),
          this.getClassName(`border-${style}-fg`),
        );
      }
      btnClass.push(
        this.getClassName(`foreground-${style}-fg`),
        this.getClassName(`background-${style}-bg`),
      );
    }
    return btnClass;
  }

  public render(): VNode {
    return <button
      class={this.btnClass}
      disabled={this.disabled}
      onClick={this.onClick}
    >
      { this.$slots.default }
    </button>;
  }
}
