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
import { StoreCommonBusState } from '@/store/common/bus';
import { StoreUserGetters } from '@/store/user';
import styles from '@/styles/views/common/static/index.module.scss';
import ToastHandler from './components/toast-handler';
import DialogHandler from './components/dialog-handler';
import PickerHandler from './components/picker-handler';
import ActionsheetHandler from './components/actionsheet-handler';

const commonBusModule = namespace('common/bus');
const userModule = namespace('user');

@Component
export default class StaticView extends Vue {
  @commonBusModule.State private readonly viewportTop!: StoreCommonBusState['viewportTop'];
  @commonBusModule.State private readonly viewportRight!: StoreCommonBusState['viewportRight'];
  @commonBusModule.State private readonly viewportBottom!: StoreCommonBusState['viewportBottom'];
  @commonBusModule.State private readonly viewportLeft!: StoreCommonBusState['viewportLeft'];
  @userModule.Getter private readonly user!: StoreUserGetters['user'];

  private get userId(): string {
    if (this.user && this.user.id) {
      return this.user.id.toString(16);
    }
    return '';
  }

  public render(): VNode {
    return <div data-comment="view-static">
      <ToastHandler></ToastHandler>
      <DialogHandler></DialogHandler>
      <PickerHandler></PickerHandler>
      <ActionsheetHandler></ActionsheetHandler>
      <portal to="application-outlet">
        <div
          class={[styles['safe-area-insets'], styles['safe-area-insets--left']]}
          style={{ width: `${this.viewportLeft}px` }}
        ></div>
        <div
          class={[styles['safe-area-insets'], styles['safe-area-insets--right']]}
          style={{ width: `${this.viewportRight}px` }}
        ></div>
        <div
          class={[styles['safe-area-insets'], styles['safe-area-insets--top']]}
          style={{ height: `${this.viewportTop}px` }}
        ></div>
        <div
          class={[styles['safe-area-insets'], styles['safe-area-insets--bottom']]}
          style={{ height: `${this.viewportBottom}px` }}
        ></div>
        <div
          v-show={this.user}
          class={styles['user-id']}
          style={{ bottom: `${this.viewportBottom}px` }}
        >#{ this.userId }</div>
      </portal>
    </div>;
  }
}
