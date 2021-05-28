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
import { ExtractModuleGetter, ExtractModuleMutation, ExtractModuleState } from '@/store';
import { COMMON } from '@/store/common';
import { StoreCommonAppModule } from '@/store/common/app';
import { StoreCommonBusModule } from '@/store/common/bus';
import { isInMobileDevice } from '@/utils/environment';

const commonAppModule = namespace('common/app');
const commonBusModule = namespace('common/bus');

@Component
export default class App extends Vue {
  @Option('blank') protected static bodyBackground: void;

  @commonAppModule.State
  private readonly entryParams!: ExtractModuleState<StoreCommonAppModule, 'entryParams'>;

  @commonBusModule.State
  private readonly viewportRight!: ExtractModuleState<StoreCommonBusModule, 'viewportRight'>;

  @commonBusModule.State
  private readonly viewportLeft!: ExtractModuleState<StoreCommonBusModule, 'viewportLeft'>;

  @commonBusModule.State
  private readonly bodyScrollable!: ExtractModuleState<StoreCommonBusModule, 'bodyScrollable'>;

  @commonBusModule.State
  private readonly bodyAutoHeight!: ExtractModuleState<StoreCommonBusModule, 'bodyAutoHeight'>;

  @commonBusModule.Getter
  private readonly headerHeight!: ExtractModuleGetter<StoreCommonBusModule, 'headerHeight'>;

  @commonBusModule.Getter
  private readonly footerHeight!: ExtractModuleGetter<StoreCommonBusModule, 'footerHeight'>;

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

  @commonBusModule.Mutation(COMMON.SET_VIEWPORT_SIZE)
  private readonly setViewportSize: ExtractModuleMutation<StoreCommonBusModule, COMMON.SET_VIEWPORT_SIZE>;

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
    return <div style={{ height: this.bodyAutoHeight ? null : '100%' }} data-comment="vue">
      <transition name="fade" mode="out-in">
        <div
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
