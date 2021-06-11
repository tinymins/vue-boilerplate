/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { VNode } from 'vue';
import { namespace } from 'vuex-class';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { ExtractModuleGetter, ExtractModuleMutation, ExtractModuleState } from '@/store';
import { COMMON } from '@/store/common';
import { StoreCommonBusModule } from '@/store/common/bus';
import { isInWebAppiOS, isInDevMode } from '@/utils/environment';
import { ActionsheetData } from '../static/components/actionsheet-handler';
import styles from './index.module.scss';

const commonBusModule = namespace('common/bus');

@Component
export default class HeaderView extends Vue {
  @commonBusModule.State('navbarTitle')
  private readonly title!: ExtractModuleState<StoreCommonBusModule, 'navbarTitle'>;

  @commonBusModule.Getter('navbarVisible')
  private readonly visible!: ExtractModuleGetter<StoreCommonBusModule, 'navbarVisible'>;

  @Watch('visible')
  protected onVisibleChange(): void {
    this.updateHeaderHeight();
    this.$nextTick(this.updateHeaderHeight);
  }

  @commonBusModule.Mutation(COMMON.SET_HEADER_HEIGHT)
  private readonly setHeaderHeight: ExtractModuleMutation<StoreCommonBusModule, COMMON.SET_HEADER_HEIGHT>;

  private back(): void {
    if (this.$router) {
      this.$router.back();
    } else {
      window.history.back();
    }
  }

  private actionsheet(): void {
    const menu: ActionsheetData['data'] = [
      { id: 'index', label: '返回首页' },
    ];
    if (isInDevMode()) {
      menu.push({ id: 'debug', label: 'Debug' });
    }
    this.$showActionsheet({
      title: '',
      data: menu,
      handler: this.actionsheetHandler,
    });
  }

  private actionsheetHandler({ id }: ActionsheetData['data'][number]): void {
    if (id === 'debug') {
      this.$router.push({
        name: 'user_login_dev',
        query: { redirect: this.$route.fullPath },
      });
    } else if (id === 'index') {
      this.$router.push({ name: 'index' });
    }
  }

  private updateHeaderHeight(): void {
    const $navbar = this.$refs.$navbar as HTMLDivElement;
    const rect = $navbar.getBoundingClientRect();
    this.setHeaderHeight(rect.height);
  }

  private onresize(): void {
    setTimeout(this.updateHeaderHeight, 300);
  }

  protected mounted(): void {
    this.onresize();
    this.updateHeaderHeight();
    window.addEventListener('resize', this.onresize);
  }

  protected beforeDestroy(): void {
    window.removeEventListener('resize', this.onresize);
  }

  public render(): VNode {
    return <div class={styles.header} v-show={this.visible}>
      <portal to="application-outlet">
        <div
          v-show={isInWebAppiOS() && this.visible}
          class={styles['header-web-app-status-bar']}
        ></div>
      </portal>
      <div
        v-show={this.visible}
        ref="$navbar"
        class={{
          [styles.navbar]: true,
          [styles['web-app']]: isInWebAppiOS(),
        }}
      >
        <div class={styles.navbar__hd} onClick={this.back}>
          <a class={styles.navbar__back}>返回</a>
          <div class={styles.navbar__arrow}></div>
        </div>
        <div class={styles.navbar__bd}>{ this.title }</div>
        <div class={styles.navbar__ft} onClick={this.actionsheet}>
          <a class={styles.navbar__more}></a>
        </div>
      </div>
    </div>;
  }
}
