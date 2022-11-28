/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { type VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

import { safeCall } from '@/utils/util';
import Popup from '@/components/popup';
import VueComponent from '@/components/vue-component';
import XButton from '@/components/x-button';

import { type PickerData, type PickerItemData } from '../types';

import styles from './index.module.scss';

export type TagPickerPosition = 'center' | 'bottom';

export interface PickerTagsProps {
  data?: PickerData | null;
}

const COLORS = [
  ['#ffffff', '#32d5c5'],
];

@Component({ name: 'picker-tags' })
export default class PickerTags extends VueComponent<PickerTagsProps> {
  @Prop({ type: Object, default: null })
  protected readonly data!: NonNullable<PickerTagsProps['data']>;

  private show = false;
  private picker: PickerData | null = null;

  private get tags(): PickerItemData[] {
    return this.picker ? this.picker.data.options : [];
  }

  private get max(): number {
    return this.picker && this.picker.maxLimit ? this.picker.maxLimit : 1;
  }

  protected get columns(): number {
    return this.picker && this.picker.columns ? this.picker.columns : 3;
  }

  private get value(): unknown[] {
    return this.picker && this.picker.value ? this.picker.value : [];
  }

  private popupVisible = this.show;
  private currentValue: PickerItemData[] = [];

  @Watch('data')
  protected onDataChange(data: PickerTags['data'], old: PickerTags['data']): void {
    if (data === old) {
      return;
    }
    if (data) {
      this.picker = data;
      this.show = true;
      this.updateCurrentValue();
    } else {
      this.show = false;
    }
  }

  @Watch('value')
  protected onValueChange(): void {
    this.updateCurrentValue();
  }

  @Watch('show')
  protected onShowChange(popupVisible: PickerTags['show']): void {
    this.popupVisible = popupVisible;
  }

  @Watch('popupVisible')
  protected onPopupVisibleChange(popupVisible: PickerTags['popupVisible']): void {
    if (!popupVisible) {
      this.cancel();
    }
  }

  private updateCurrentValue(): void {
    this.currentValue = [];
    const picker = this.picker;
    if (!picker) {
      return;
    }
    this.value.forEach((val) => {
      const item = picker.data.options.find(p => p.value === val);
      if (item) {
        this.currentValue.push(item);
      }
    });
  }

  private clickItem(item: PickerItemData<unknown, unknown>): void {
    if (this.currentValue.includes(item)) {
      const index = this.currentValue.indexOf(item);
      this.currentValue.splice(index, 1);
    } else if (this.currentValue.length < this.max) {
      this.currentValue.push(item);
    } else {
      this.currentValue.shift();
      this.currentValue.push(item);
    }
  }

  private submit(): void {
    const picker = this.picker;
    if (!this.show || !picker) {
      return;
    }
    this.$hidePicker(picker);
    safeCall(picker.handler, this.currentValue);
    safeCall(picker.onclose);
  }

  private cancel(): void {
    const picker = this.picker;
    if (!this.show || !picker) {
      return;
    }
    this.$hidePicker(picker);
    safeCall(picker.oncancel);
    safeCall(picker.onclose);
  }

  private renderCenterPicker(): VNode {
    return <Popup class={styles.picker} v-model={this.popupVisible} position="center" mask-closable>
      <div class={styles['picker-inner']}>
        <div class={styles['picker-title']}>
          <span class={styles['picker-title-line']}></span>
          <span class={styles['picker-title-text']}>最多可选{ this.max }个</span>
          <span class={styles['picker-title-line']}></span>
        </div>
        <div class={styles['picker-list']}>
          {
            this.tags.map((tag, index) => <div class={styles['picker-item']}>
              <div
                class={{
                  [styles['picker-item-content']]: true,
                  [styles['no-border']]: this.currentValue.includes(tag),
                }}
                style={{
                  color: this.currentValue.includes(tag)
                    ? tag.color || COLORS[index % COLORS.length][0]
                    : null,
                  'background-color': this.currentValue.includes(tag)
                    ? tag.bgColor || COLORS[index % COLORS.length][1]
                    : null,
                }}
                onClick={() => this.clickItem(tag)}
              >{ tag.label }</div>
            </div>)
          }
        </div>
        <div class={styles['picker-btn']}>
          <XButton class={styles['picker-btn-cancel']} invert inline on={{ click: this.cancel }}>取消</XButton>
          <XButton class={styles['picker-btn-confirm']} invert inline primary on={{ click: this.submit }}>确定</XButton>
        </div>
      </div>
    </Popup>;
  }

  public render(): VNode {
    return this.renderCenterPicker();
  }
}
