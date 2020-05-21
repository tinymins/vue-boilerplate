/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { VNode } from 'vue';
import { namespace } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
import safeAreaInsets from 'safe-area-insets';
import Option from '@/decorators/option';
import { COMMON } from '@/store/types';
import { isInMobileDevice } from '@/utils/environment';
import { StoreCommonAppState } from '@/store/common/app';
import { StoreCommonBusState, StoreCommonBusGetters } from '@/store/common/bus';

const commonAppModule = namespace('common/app');
const commonBusModule = namespace('common/bus');

@Component
export default class App extends Vue {
  @Option('blank') protected static bodyBackground;

  @commonAppModule.State private readonly entryParams!: StoreCommonAppState['entryParams'];
  @commonBusModule.State private readonly viewportRight!: StoreCommonBusState['viewportRight'];
  @commonBusModule.State private readonly viewportLeft!: StoreCommonBusState['viewportLeft'];
  @commonBusModule.State private readonly bodyScrollable!: StoreCommonBusState['bodyScrollable'];
  @commonBusModule.State private readonly bodyAutoHeight!: StoreCommonBusState['bodyAutoHeight'];
  @commonBusModule.Getter private readonly headerHeight!: StoreCommonBusGetters['headerHeight'];
  @commonBusModule.Getter private readonly footerHeight!: StoreCommonBusGetters['footerHeight'];

  public updateViewportSize(): void {
    this.setViewportSize({
      top: safeAreaInsets.top,
      bottom: safeAreaInsets.bottom,
      left: safeAreaInsets.left,
      right: safeAreaInsets.right,
      width: window.innerWidth - safeAreaInsets.left - safeAreaInsets.right,
      height: window.innerHeight - safeAreaInsets.top - safeAreaInsets.bottom,
    });
  }

  public onresize(): void {
    setTimeout(this.updateViewportSize, 300);
  }

  @commonBusModule.Mutation(COMMON.SET_VIEWPORT_SIZE) private setViewportSize;

  public mounted(): void {
    if (isInMobileDevice(this.entryParams.userAgent)) {
      safeAreaInsets.onChange(this.onresize);
    }
    this.onresize();
    this.updateViewportSize();
    window.addEventListener('resize', this.onresize);
  }

  public beforeDestroy(): void {
    window.removeEventListener('resize', this.onresize);
  }

  public render(): VNode {
    return <div data-comment="vue">
      <transition name="fade" mode="out-in">
        <div
          id="app"
          style={{
            height: this.bodyAutoHeight ? null : '100%',
            display: this.bodyAutoHeight ? null : 'flex',
            flexDirection: this.bodyAutoHeight ? null : 'column',
            boxSizing: this.bodyAutoHeight ? null : 'border-box',
            overflow: this.bodyScrollable ? null : 'hidden',
            padding: `${this.headerHeight}px ${this.viewportRight}px ${this.footerHeight}px ${this.viewportLeft}px`,
          }}
          data-comment="app"
        >
          <router-view name="static"></router-view>
          <router-view name="header" style={{ flex: this.bodyAutoHeight ? null : '0 0 auto' }}></router-view>
          <router-view name="main" style={{ flex: this.bodyAutoHeight ? null : '1 1 auto' }}></router-view>
          <router-view name="footer" style={{ flex: this.bodyAutoHeight ? null : '0 0 auto' }}></router-view>
        </div>
      </transition>
      <portal-target name="application-outlet" multiple data-comment="portal"></portal-target>
    </div>;
  }
}
