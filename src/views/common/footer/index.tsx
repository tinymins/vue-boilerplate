/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { type VNode } from 'vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { NavigationGuardNext, Route } from 'vue-router';
import { namespace } from 'vuex-class';

import { routeClone, RouteInfo } from '@/utils/navigation';
import { AsyncDataParam, AsyncDataReturn } from '@/router';
import { getTabbarData, getTabbarInfo, TabbarItemData } from '@/router/tabbars';
import { type ExtractModuleGetter, type ExtractModuleMutation, type ExtractModuleState, type StoreInstance } from '@/store';
import { COMMON } from '@/store/common';
import { type StoreCommonBusModule } from '@/store/common/bus';
import { USER } from '@/store/user';

import styles from './index.module.scss';

const dispatchData = (store: StoreInstance): Promise<void> => new Promise((resolve, reject) => {
  store.dispatch(`user/${USER.GET}`, { strict: false })
    .then((res) => {
      resolve();
      return res;
    })
    .catch(reject);
});

const commonBusModule = namespace('common/bus');

@Component
export default class FooterView extends Vue {
  @commonBusModule.State
  private readonly viewportBottom!: ExtractModuleState<StoreCommonBusModule, 'viewportBottom'>;

  @commonBusModule.Getter('tabbarVisible')
  private readonly visible!: ExtractModuleGetter<StoreCommonBusModule, 'tabbarVisible'>;

  private inited = false;

  /** 标签页最后一次路由 */
  private tabLastRoute: Record<string, Record<number, RouteInfo>> = {};

  /** 标签页第一次入口路由 */
  private tabEntryRoute: Record<string, Record<number, RouteInfo>> = {};

  protected asyncData({ store }: AsyncDataParam): AsyncDataReturn {
    return dispatchData(store);
  }

  private get tabList(): TabbarItemData[] {
    return getTabbarData(this.$route);
  }

  private get selected(): string {
    return getTabbarInfo(this.$route).name;
  }

  @Watch('inited')
  protected onInitedChange(): void {
    this.updateFooterHeight();
    this.$nextTick(this.updateFooterHeight);
  }

  @Watch('visible')
  protected onVisibleChange(): void {
    this.updateFooterHeight();
    this.$nextTick(this.updateFooterHeight);
  }

  @Watch('viewportBottom', { immediate: true })
  protected onViewportBottomChange(viewportBottom: FooterView['viewportBottom']): void {
    const $tabbar = this.$refs.$tabbar as HTMLDivElement;
    if (!$tabbar) {
      return;
    }
    $tabbar.style.bottom = `${viewportBottom}px`;
  }

  @commonBusModule.Mutation(COMMON.SET_TABBAR_HEIGHT)
  private readonly setFooterHeight!: ExtractModuleMutation<StoreCommonBusModule, COMMON.SET_TABBAR_HEIGHT>;

  private updateFooterHeight(): void {
    const $tabbar = this.$refs.$tabbar as HTMLDivElement;
    if (!$tabbar) {
      return;
    }
    const rect = $tabbar.getBoundingClientRect();
    this.setFooterHeight(rect.height);
  }

  private onresize(): void {
    setTimeout(this.updateFooterHeight, 300);
  }

  private onRouteChange(to: Route, from: Route | null = null, next: (() => void) | null = null): void {
    if (from) {
      this.setLastRoute(from);
    }
    if (next) {
      dispatchData(this.$store)
        .then((res) => {
        /*
         * if (this.$route.query.reload) {
         *   const removeOnceParam = () => {
         *     const redirect = routeClone(this.$route);
         *     delete redirect.query.reload;
         *     this.$router.replace(redirect);
         *   };
         *   this.$nextTick(removeOnceParam);
         * }
         */
          if (next) {
            next();
          }
          return res;
        })
        .catch((error: unknown) => { throw error; });
    }
  }

  private onClick(tab: TabbarItemData): void {
    this.setLastRoute(this.$route);
    const fromIndex = this.getCurrentIndex();
    const toIndex = this.tabList.indexOf(tab);
    const info = getTabbarInfo(this.$route);
    // 从其他标签页切换 尝试恢复上次路由
    if (fromIndex !== toIndex && tab.rememberRoute && this.tabLastRoute[info.category] && this.tabLastRoute[info.category][toIndex]) {
      this.$router.push(this.tabLastRoute[info.category][toIndex]);
      return void 0;
    }
    // 同标签页再次点击 尝试触发高级自定义操作
    const tabbarAction = this.$route.matched.map(record => record.meta.tabbarAction).filter(Boolean).pop();
    if (fromIndex === toIndex && tabbarAction && tabbarAction(this.$route, this.$router) !== false) {
      return void 0;
    }
    // 默认行为 前往标签起始路由
    const onComplete = (): void => {
      if (this.visible && this.getCurrentIndex() === toIndex) {
        this.setEntryRoute(this.$route, toIndex);
      }
    };
    if (!tab.route) {
      return void 0;
    }
    return this.$router.push(tab.route, onComplete, onComplete);
  }

  private getCurrentIndex(): number {
    return this.tabList.findIndex(v => this.selected === v.name);
  }

  private setLastRoute(route: Route): void {
    if (!this.visible || route.query.autoNav) {
      return;
    }
    const info = getTabbarInfo(route);
    const index = this.tabList.findIndex(v => info.name === v.name);
    if (!this.tabLastRoute[info.category]) {
      this.tabLastRoute[info.category] = {};
    }
    this.tabLastRoute[info.category][index] = routeClone(route);
  }

  private setEntryRoute(route: Route, index: number): void {
    const info = getTabbarInfo(route);
    if (!this.tabEntryRoute[info.category]) {
      this.tabEntryRoute[info.category] = {};
    }
    if (this.tabEntryRoute[info.category][index]) {
      return;
    }
    this.tabEntryRoute[info.category][index] = routeClone(route);
  }

  public mounted(): void {
    this.onRouteChange(this.$route);
    this.onresize();
    this.updateFooterHeight();
    window.addEventListener('resize', this.onresize);
    this.inited = true;
  }

  public beforeDestroy(): void {
    window.removeEventListener('resize', this.onresize);
  }

  public beforeRouteUpdate(to: Route, from: Route, next: NavigationGuardNext<FooterView>) {
    this.onRouteChange(to, from, next);
  }

  public beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext<FooterView>) {
    this.onRouteChange(to, from, next);
  }

  public render(): VNode {
    return <div class={styles.footer} v-show={this.visible || !this.inited}>
      <div class={styles.tabbar} ref="$tabbar" style={{ bottom: `${this.viewportBottom}px` }}>
        {
          this.tabList.map(tab => <div
            class={{
              [styles['tabbar-item']]: true,
              [styles.actived]: this.selected === tab.name || tab.static,
              [styles.popup]: tab.popupIcon,
              [styles.untitled]: !tab.text,
            }}
            onClick={() => this.onClick(tab)}
          >
            <div class={styles['tabbar-item__main']}></div>
            { tab.text ? <div class={styles['tabbar-item__label']}>{ tab.text }</div> : null }
          </div>)
        }
      </div>
    </div>;
  }
}
