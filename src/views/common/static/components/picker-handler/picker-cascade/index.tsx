/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { type VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { easeOutCubic } from '@/utils/easing';
import { findPickerIndex, safeCall } from '@/utils/util';
import { type ExtractModuleGetter } from '@/store';
import { type StoreCommonBusModule } from '@/store/common/bus';
import Popup from '@/components/popup';
import VueComponent from '@/components/vue-component';

import { type PickerData, type PickerGroupData, type PickerItemData } from '../types';

import styles from './index.module.scss';

const DEFAULT_ANIMATION_TIME = 1000;

const commonBusModule = namespace('common/bus');

interface PickerCascadeProps {
  data?: PickerData | null;
}

@Component({ name: 'picker-cascade' })
export default class PickerCascade extends VueComponent<PickerCascadeProps> {
  @Prop({ type: Object, default: null })
  protected readonly data!: NonNullable<PickerCascadeProps['data']>;

  /** 可见区高度 */
  @commonBusModule.Getter
  private readonly mainViewportHeight!: ExtractModuleGetter<StoreCommonBusModule, 'mainViewportHeight'>;

  /** 可见区宽度 */
  @commonBusModule.Getter
  private readonly mainViewportWidth!: ExtractModuleGetter<StoreCommonBusModule, 'mainViewportWidth'>;

  /** 是否可见 */
  private show = false;
  /** 当前渲染的数据 */
  private picker: PickerData | null = null;
  private selectedIndex: number[] = [];
  /** 整个组件高度 */
  private height = 0;
  /** 遮罩+选择框 总高度 */
  private bodyHeight = 0;
  /** 选项列表标题高度 */
  private groupTitleHeight = 0;
  /** 选项列表上下边距 */
  private groupPadding = 0;
  /** 上下遮罩高度 */
  private shadowHeight = 0;
  /** 选中项露出部分高度 */
  private shadowGapHeight = 0;
  /** 多点触控信息 */
  private touchesPos: Record<string | number, { startY: number; currentY: number }> = {};
  /** 选项卡移动记录 用于计算加速度 */
  private groupScrollMovements: { time: number; scrollTop: number }[] = [];
  /** 选项卡滚动动画 */
  private groupScrollAnimationTimer: Record<number, number> = {};

  private get groups(): PickerGroupData[] {
    const groups: PickerGroupData[] = [];
    if (this.picker) {
      let i = 0;
      let group: PickerGroupData | undefined = this.picker.data;
      while (group) {
        groups.push(group);
        const item: PickerItemData = group.options[this.selectedIndex[i] || 0];
        group = item && item.children && item.children.options.length > 0 ? item.children : void 0;
        i += 1;
      }
    }
    return groups;
  }

  private get hasGroupTitle(): boolean {
    return this.groups.some(g => !!g.title);
  }

  @Watch('data')
  protected onDataChange(data: PickerCascade['data'], old: PickerCascade['data']): void {
    if (data === old) {
      return;
    }
    if (data) {
      this.show = true;
      this.picker = data;
    } else {
      this.show = false;
    }
  }

  @Watch('picker')
  protected onPickerChange(picker: PickerCascade['picker'], old: PickerCascade['picker']): void {
    if (picker === old) {
      return;
    }
    this.parseSelectedIndex(0);
  }

  @Watch('groups')
  protected onGroupsChange(groups: PickerCascade['groups'], old: PickerCascade['groups']): void {
    if (groups === old) {
      return;
    }
    this.$nextTick(this.updateElementHeight);
  }

  @Watch('$route')
  protected onRouteChange(): void {
    if (this.show) {
      this.$hidePicker({ action: 'clear' });
    }
  }

  @Watch('mainViewportHeight')
  protected onMainViewportHeightChange(): void {
    this.updateElementHeight(200);
  }

  /**
   * 通过传入的 selected 计算选中的下标
   * @param {number} duration 界面滚动动画时间
   * @returns {void}
   */
  private parseSelectedIndex(duration: number = DEFAULT_ANIMATION_TIME): void {
    if (!this.picker) {
      return;
    }
    this.selectedIndex = findPickerIndex(this.picker.data, this.picker.value);
    this.$nextTick(() => this.updateElementHeight(duration));
  }

  /**
   * 计算各部分高度进行布局
   * @param {number} duration 界面滚动动画时间
   * @returns {void}
   */
  private updateElementHeight(duration: number = DEFAULT_ANIMATION_TIME): void {
    this.height = this.mainViewportHeight / 2;
    const $header = this.$refs.$header as HTMLElement;
    this.bodyHeight = this.height - ($header ? $header.clientHeight : 0);
    const $shadowGap = this.$refs.$shadowGap as HTMLElement;
    this.shadowGapHeight = $shadowGap ? $shadowGap.clientHeight : 0;
    let groupTitleHeight = 0;
    for (let i = 0; i < this.groups.length; i += 1) {
      const el = this.$refs[`$pickerGroupTitle${i}`] as HTMLElement;
      if (el) {
        groupTitleHeight = el.clientHeight;
        break;
      }
    }
    this.groupTitleHeight = groupTitleHeight;
    this.shadowHeight = (this.bodyHeight - groupTitleHeight - this.shadowGapHeight) / 2;
    this.groupPadding = this.shadowHeight + (this.shadowGapHeight || 50); // 加大padding用于顶部回弹
    this.$nextTick(() => this.updateScrollPos(duration));
  }

  /**
   * 根据当前滚动位置吸附滚动选中项
   * @returns {void}
   */
  private correctScrollPos(): void {
    let i = 0;
    const selectedFilter = (_: unknown, j: number): boolean => j < i;
    while (this.$refs[`$pickerGroupOption${i}`]) {
      const groupIndex = i;
      const el = this.$refs[`$pickerGroupOption${groupIndex}`] as HTMLElement;
      const gapCenterTop = el.scrollTop + this.shadowHeight + this.shadowGapHeight / 2;
      let closestEl: HTMLElement | undefined;
      let itemIndex = 0;
      let distance = -1;
      for (let j = 0; j < el.childElementCount; j += 1) {
        const ch = el.children[j] as HTMLElement;
        const dist = Math.abs(ch.offsetTop + ch.clientHeight / 2 - gapCenterTop);
        if (distance >= 0 && dist > distance) {
          break;
        }
        distance = dist;
        itemIndex = j;
        closestEl = ch;
      }
      if (closestEl) {
        this.scrollGroupItemIntoView(groupIndex, itemIndex, 300);
        if (this.selectedIndex[groupIndex] !== itemIndex) {
          /*
           * 仅改变当前滚动项：
           * this.$set(this.selectedIndex, groupIndex, index);
           *
           * 改变当前滚动项目同时清空子项滚动位置：
           */
          const selectedIndex = this.selectedIndex.filter(selectedFilter);
          selectedIndex.push(itemIndex);
          this.selectedIndex = selectedIndex;
          this.$nextTick(this.updateScrollPos);
          break;
        }
      }
      i += 1;
    }
  }

  /**
   * 减速滚动至元素
   * @param {number} groupIndex 待滚动的分组号
   * @param {number} toScrollTop 目标滚动位置
   * @param {number} duration 滚动时间
   * @returns {Promise} Promise
   */
  private animateGroupScroll(groupIndex: number, toScrollTop: number, duration: number): Promise<void> {
    if (duration > 0) {
      return new Promise((resolve, reject) => {
        if (this.groupScrollAnimationTimer[groupIndex]) {
          clearInterval(this.groupScrollAnimationTimer[groupIndex]);
          this.groupScrollAnimationTimer[groupIndex] = 0;
        }
        const el = this.$refs[`$pickerGroupOption${groupIndex}`] as HTMLElement;
        if (el) {
          const fromTime = Date.now();
          const fromScrollTop = el.scrollTop;
          this.groupScrollAnimationTimer[groupIndex] = window.setInterval(() => {
            const t = Math.min((Date.now() - fromTime) / duration, 1);
            if (t === 1) {
              clearInterval(this.groupScrollAnimationTimer[groupIndex]);
              resolve();
            }
            el.scrollTop = fromScrollTop + (toScrollTop - fromScrollTop) * easeOutCubic(t);
          });
        } else {
          reject();
        }
      });
    }
    const el = this.$refs[`$pickerGroupOption${groupIndex}`] as HTMLElement;
    if (el) {
      el.scrollTop = toScrollTop;
    }
    return Promise.resolve();
  }

  private scrollGroupItemIntoView(groupIndex: number, itemIndex: number, duration: number): Promise<void> {
    const groupEl = this.$refs[`$pickerGroupOption${groupIndex}`] as HTMLElement;
    if (!groupEl) {
      return Promise.reject();
    }
    const itemEl = groupEl.children[itemIndex || 0] as HTMLElement;
    if (!itemEl) {
      return Promise.reject();
    }
    const toTop = itemEl.offsetTop - this.shadowHeight - (this.shadowGapHeight - itemEl.clientHeight) / 2;
    return this.animateGroupScroll(groupIndex, toTop, duration);
  }

  /**
   * 根据数据应用滚动选中项位置
   * @param {number} duration 动画时间
   * @returns {void}
   */
  private updateScrollPos(duration: number = DEFAULT_ANIMATION_TIME): void {
    let i = 0;
    while (this.$refs[`$pickerGroupOption${i}`]) {
      this.scrollGroupItemIntoView(i, this.selectedIndex[i], duration);
      i += 1;
    }
  }

  private onGroupScrollStart(groupIndex: number, scrollTop: number): void {
    if (this.groupScrollAnimationTimer[groupIndex]) {
      clearInterval(this.groupScrollAnimationTimer[groupIndex]);
      this.groupScrollAnimationTimer[groupIndex] = 0;
    }
    this.groupScrollMovements = [{ time: Date.now(), scrollTop }];
  }

  private onGroupScrollStep(groupIndex: number, scrollTop: number): void {
    const el = this.$refs[`$pickerGroupOption${groupIndex}`] as HTMLElement;
    if (!el) {
      return;
    }
    el.scrollTop = scrollTop;
    // 最近的几次位置记录用于计算加速度
    const movements = this.groupScrollMovements;
    while (movements.length > 100) {
      movements.shift();
    }
    movements.push({ time: Date.now(), scrollTop });
  }

  private onGroupScrollStop(groupIndex: number): void {
    const el = this.$refs[`$pickerGroupOption${groupIndex}`] as HTMLElement;
    if (!el) {
      return;
    }
    const movements = this.groupScrollMovements;
    const time = Date.now();
    const cur = movements[movements.length - 1];
    const rec = movements.find(m => time - m.time <= 50 && time - m.time >= 20);
    if (cur && rec) {
      const speed = (cur.scrollTop - rec.scrollTop) / (cur.time - rec.time);
      const toTop = Math.min(Math.max(el.scrollTop + speed * 100, 0), el.scrollHeight - el.clientHeight);
      const duration = Math.min(Math.abs(speed * 1000), Math.abs(toTop - el.scrollTop) * 20, 750);
      this.animateGroupScroll(groupIndex, toTop, duration)
        .then(this.correctScrollPos)
        .catch((error: unknown) => { throw error; });
    } else {
      this.$nextTick(this.correctScrollPos);
    }
    this.groupScrollMovements = [];
  }

  /**
   * PC端鼠标拖拽
   * @param {MouseEvent} event 鼠标事件
   * @param {number} groupIndex 选择器组序号
   * @returns {void}
   */
  private onGroupMouseDown(event: MouseEvent, groupIndex: number): void {
    const el = this.$refs[`$pickerGroupOption${groupIndex}`] as HTMLElement;
    if (!el) {
      return;
    }
    const fromY = event.clientY;
    const fromScrollTop = el.scrollTop;
    this.onGroupScrollStart(groupIndex, fromScrollTop);

    const onMouseMove = (e: MouseEvent): void => {
      this.onGroupScrollStep(groupIndex, fromScrollTop - (e.pageY - fromY));
    };
    document.addEventListener('mousemove', onMouseMove);

    const onMouseUp = (): void => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      this.onGroupScrollStop(groupIndex);
    };
    document.addEventListener('mouseup', onMouseUp);
  }

  /**
   * 移动端触摸
   * @param {TouchEvent} event 触摸事件
   * @param {number} groupIndex 选择器组序号
   * @returns {void}
   */
  private onGroupTouchstart(event: TouchEvent, groupIndex: number): void {
    const el = this.$refs[`$pickerGroupOption${groupIndex}`] as HTMLElement;
    if (!el) {
      return;
    }
    // prevent default
    event.preventDefault();
    event.stopPropagation();

    const fromScrollTop = el.scrollTop;
    if (event.touches.length === 1) {
      this.touchesPos = {};
      this.onGroupScrollStart(groupIndex, fromScrollTop);
    }
    // record touch start pos
    Object.keys(event.changedTouches).forEach((i) => {
      const touch = event.changedTouches[i];
      this.touchesPos[touch.identifier] = {
        startY: touch.clientY,
        currentY: touch.clientY,
      };
    });

    const onTouchMove = (e: TouchEvent): void => {
      // prevent default
      e.preventDefault();
      e.stopPropagation();
      // update current touch pos
      Object.keys(e.changedTouches).forEach((i) => {
        const touch = e.changedTouches[i];
        const cache = this.touchesPos[touch.identifier];
        if (cache) {
          cache.currentY = touch.clientY;
        }
      });
      // calc touches sum delta distance
      let touchDeltaY = 0;
      Object.values(this.touchesPos).forEach((touch) => {
        touchDeltaY += touch.currentY - touch.startY;
      });
      this.onGroupScrollStep(groupIndex, fromScrollTop - touchDeltaY);
    };
    el.addEventListener('touchmove', onTouchMove);

    const onTouchEnd = (e: TouchEvent): void => {
      if (e && e.touches && e.touches.length > 0) {
        return;
      }
      // prevent default
      e.preventDefault();
      e.stopPropagation();
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      this.onGroupScrollStop(groupIndex);
    };
    el.addEventListener('touchend', onTouchEnd);
  }

  private cancel(): void {
    const picker = this.picker;
    if (!picker) {
      return;
    }
    this.$hidePicker(picker);
    safeCall(picker.oncancel);
    safeCall(picker.onclose);
  }

  private submit(): void {
    const picker = this.picker;
    if (!picker) {
      return;
    }
    this.$hidePicker(picker);
    let i = 0;
    let group: PickerGroupData | undefined = picker.data;
    while (group) {
      const item: PickerItemData = group.options[this.selectedIndex[i] || 0];
      if (item) {
        if (item.children && item.children.options.length > 0) {
          group = item.children;
        } else {
          safeCall(picker.handler, [item]);
          safeCall(picker.onclose);
          break;
        }
      }
      i += 1;
    }
  }

  protected mounted(): void {
    this.$nextTick(() => this.updateElementHeight(0));
  }

  private renderPickerGroups(): VNode[] {
    const nodes: VNode[] = [];
    this.groups.forEach((group, i) => {
      nodes.push(<div
        class={styles['picker-group']}
        style={{
          height: `${this.bodyHeight}px`,
          width: `${this.mainViewportWidth / this.groups.length}px`,
        }}
      >
        <div v-show={this.hasGroupTitle} class={styles['picker-group__title']} ref={`$pickerGroupTitle${i}`}>
          { group.title }
        </div>
        <div
          class={styles['picker-group__option']}
          ref={`$pickerGroupOption${i}`}
          onMousedown={(e: MouseEvent) => this.onGroupMouseDown(e, i)}
          onTouchstart={(e: TouchEvent) => this.onGroupTouchstart(e, i)}
          disable-prevent-overscroll
        >
          {
            group.options.map((item, j) => <div class={{
              [styles['picker-item']]: true,
              [styles['picker-item--selected']]: (this.selectedIndex[i] || 0) === j,
            }}
            style={{
              'margin-top': j === 0 ? `${this.groupPadding}px` : null,
              'margin-bottom': j === group.options.length - 1 ? `${this.groupPadding}px` : null,
            }}
            >{ item.label }</div>)
          }
        </div>
      </div>);
    });
    return nodes;
  }

  private renderPicker(): VNode | null {
    if (!this.picker) {
      return null;
    }
    return <div class={styles.picker}>
      <div class={styles.picker__hd} ref="$header">
        <span class={styles.picker__cancel} onClick={this.cancel}>取消</span>
        <span class={styles.picker__title}>{this.picker.title}</span>
        <span class={styles.picker__confirm} onClick={this.submit}>确定</span>
      </div>
      <div class={styles.picker__bd} style={{ height: `${this.bodyHeight}px` }}>
        <div class={styles['picker-shadow']}>
          <i class={styles['picker-shadow__title']} style={{ height: `${this.groupTitleHeight}px` }}></i>
          <i class={styles['picker-shadow__top']}></i>
          <i class={styles['picker-shadow__center']} ref="$shadowGap"></i>
          <i class={styles['picker-shadow__bottom']}></i>
        </div>
        <div class={styles['picker-groups']} style={{ height: `${this.bodyHeight}px` }}>
          { this.renderPickerGroups() }
        </div>
      </div>
    </div>;
  }

  public render(): VNode | null {
    return <Popup
      v-model={this.show}
      position="bottom"
      on={{ 'mask-click': this.cancel }}
    >
      { this.renderPicker() }
    </Popup>;
  }
}
