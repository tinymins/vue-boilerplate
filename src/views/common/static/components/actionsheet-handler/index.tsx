/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { type VNode } from 'vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { type BasicUniqueObject } from '@/types';
import { safeCall } from '@/utils/util';
import { type ExtractModuleState } from '@/store';
import { type StoreCommonBusModule } from '@/store/common/bus';
import Popup from '@/components/popup';

import styles from './index.module.scss';

export interface ActionsheetItemData<T = unknown> {
  id: string;
  label: string;
  value?: T;
}

export interface ActionsheetData<T = unknown> extends BasicUniqueObject {
  title?: string;
  data: ActionsheetItemData<T>[];
  handler?: (item: ActionsheetItemData<T>, index: number) => void;
  oncancel?: () => void;
  onclose?: () => void;
}

const commonBusModule = namespace('common/bus');

@Component
export default class ActionsheetHandler extends Vue {
  @commonBusModule.State
  private readonly actionsheets!: ExtractModuleState<StoreCommonBusModule, 'actionsheets'>;

  private show = false;
  private actionsheet: ActionsheetData | null = null;

  protected get actionsheetReal(): ActionsheetData | undefined {
    return this.actionsheets[0];
  }

  @Watch('actionsheetReal')
  protected onActionsheetRealChange(actionsheetReal?: ActionsheetHandler['actionsheetReal'], old?: ActionsheetHandler['actionsheetReal']): void {
    if (actionsheetReal === old) {
      return;
    }
    if (actionsheetReal) {
      this.actionsheet = actionsheetReal;
      this.show = true;
    } else {
      this.show = false;
    }
  }

  @Watch('$route')
  protected onRouteChange(): void {
    if (this.show) {
      this.$hideActionsheet({ action: 'clear' });
    }
  }

  private onItemClick(item: ActionsheetItemData, index: number): void {
    const actionsheet = this.actionsheet;
    if (!actionsheet) {
      return;
    }
    this.$hideActionsheet(actionsheet);
    safeCall(actionsheet.handler, item, index);
    safeCall(actionsheet.onclose);
  }

  private onCancel(): void {
    const actionsheet = this.actionsheet;
    if (!actionsheet) {
      return;
    }
    this.$hideActionsheet(actionsheet);
    safeCall(actionsheet.oncancel);
    safeCall(actionsheet.onclose);
  }

  public render(): VNode | null {
    if (!this.actionsheet) {
      return null;
    }
    return <Popup v-model={this.show} position="bottom" on={{ 'mask-click': this.onCancel }}>
      {
        this.actionsheet.title
          ? <div class={styles['actionsheet-title']}>{ this.actionsheet.title }</div>
          : null
      }
      {
        this.actionsheet.data.map((item, i) => <div class={styles['actionsheet-item']} onClick={() => this.onItemClick(item, i)}>
          { item.label }
        </div>)
      }
      <div class={styles['actionsheet-gap']}></div>
      <div class={styles['actionsheet-cancel']} onClick={this.onCancel}>取消</div>
    </Popup>;
  }
}
