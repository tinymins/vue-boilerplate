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
import { BasicUniqueObject } from '@/types';
import { StoreCommonBusState } from '@/store/common/bus';
import { safeCall } from '@/utils/util';
import Popup from '@/components/popup';
import XButton from '@/components/x-button';
import styles from './index.module.scss';

export interface DialogButtonData {
  action?: () => void;
  primary?: boolean;
  label: string;
}

export interface DialogData extends BasicUniqueObject {
  title?: string;
  content?: string;
  render?: (h: Function) => VNode | VNode[] | undefined | null;
  isHTML?: boolean;
  type?: string;
  buttons?: DialogButtonData[];
  onclose?: () => void;
}

const commonBusModule = namespace('common/bus');

@Component
export default class DialogHandler extends Vue {
  @commonBusModule.State private readonly dialogs!: StoreCommonBusState['dialogs'];

  private show = false;
  private dialog: DialogData | null = null;

  private get dialogReal(): DialogData | null {
    const dialog = this.dialogs[0] ? Object.assign({}, this.dialogs[0]) : null;
    if (dialog) {
      if (dialog.type === 'confirm' && dialog.buttons && dialog.buttons.length === 1) {
        dialog.buttons = dialog.buttons.concat([{ label: '取消' }]);
      }
      if (!dialog.buttons || dialog.buttons.length === 0) {
        dialog.buttons = [{ label: '确定', primary: true }];
      }
    }
    return dialog;
  }

  @Watch('dialogReal')
  protected onDialogRealChange(dialogReal, old): void {
    if (dialogReal === old) {
      return;
    }
    if (old) {
      safeCall(old.onclose);
    }
    if (dialogReal) {
      this.dialog = dialogReal;
      this.show = true;
    } else {
      this.show = false;
    }
  }

  @Watch('$route')
  protected onRouteChange(): void {
    if (this.show) {
      this.$hideDialog({ action: 'clear' });
    }
  }

  private onButtonClick(dialog, button): void {
    safeCall(button.action);
    this.$hideDialog(dialog);
  }

  private renderContent(h, dialog): VNode {
    if (dialog.render) {
      return dialog.render(h);
    }
    if (dialog.isHTML) {
      return <p domPropsInnerHTML={dialog.content}></p>;
    }
    if (dialog.content.indexOf('br')) {
      return <p domPropsInnerHTML={dialog.content}></p>;
    }
    return dialog.content.split('\n').map(s => <p>{s}</p>);
  }

  protected render(h): VNode | null {
    if (!this.dialog) {
      return null;
    }
    return <Popup v-model={this.show} position="center">
      <div class={styles.dialog}>
        <div class={styles.dialog__title}>{this.dialog.title}</div>
        <div class={styles.dialog__content}>
          { this.renderContent(h, this.dialog) }
        </div>
        <div class={styles.dialog__buttons}>
          {
            this.dialog.buttons
              ? this.dialog.buttons.map(button => <XButton
                class={styles.dialog__button}
                invert
                primary={button.primary}
                on={{ click: () => this.onButtonClick(this.dialog, button) }}
              >{button.label}</XButton>)
              : null
          }
        </div>
      </div>
    </Popup>;
  }
}
