/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { VNode } from 'vue';
import { namespace } from 'vuex-class';
import { Component, Prop, Watch } from 'vue-property-decorator';
import VueComponent from '@/components/vue-component';
import { ExtractModuleMutation } from '@/store';
import { StoreCommonBusModule } from '@/store/common/bus';
import { COMMON } from '@/store/common';
import { easeInBack, easeOutBack } from '@/utils/cubic-bezier';
import styles from './index.module.scss';

export type PopupPosition = 'top' | 'left' | 'right' | 'bottom' | 'center';

export interface PopupProps {
  value?: boolean;
  position?: PopupPosition;
  direction?: PopupPosition;
  zIndex?: number | string;
  fullscreen?: boolean;
  noMask?: boolean;
  maskClosable?: boolean;
  maskOpacity?: number;
}

const commonBusModule = namespace('common/bus');

@Component({ name: 'popup' })
export default class Popup extends VueComponent<PopupProps> {
  @Prop({ type: Boolean, default: false })
  private value!: boolean;

  @Prop({ type: String, default: 'bottom' })
  private position!: PopupPosition;

  @Prop({ type: String, default: void 0 })
  private direction!: PopupPosition;

  @Prop({ type: [Number, String], default: 99 })
  private zIndex!: number | string;

  @Prop({ type: Boolean, default: false })
  private fullscreen!: boolean;

  @Prop({ type: Boolean, default: false })
  private noMask!: boolean;

  @Prop({ type: Boolean, default: false })
  private maskClosable!: boolean;

  @Prop({ type: Number, default: 0.4 })
  private maskOpacity!: number;

  private opacity = 0;
  private created = false;
  private visible = false;
  private animation = 'hide';
  private timerAnimation = 0;

  private get transformStyle(): Record<string, string> {
    const style: Record<string, string> = {
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: this.zIndex.toString(),
    };
    switch (this.direction || this.position) {
      case 'top':
        style.transform = `translate(0, ${(this.opacity - 1) * 100}%)`;
        break;
      case 'left':
        style.transform = `translate(${(this.opacity - 1) * 100}%, 0)`;
        break;
      case 'right':
        style.transform = `translate(${(1 - this.opacity) * 100}%, 0)`;
        break;
      case 'bottom':
        style.transform = `translate(0, ${(1 - this.opacity) * 100}%)`;
        break;
      case 'center':
        style.opacity = this.opacity ? '1' : '0';
        style.transform = `scale(${(this.opacity * 0.7) + 0.3})`;
        style.transition = `opacity .3s ease-in-out, transform .3s ${this.opacity ? easeOutBack : easeInBack}`;
        break;
      default:
    }
    const fullscreen = !this.fullscreen && (!this.direction || this.direction === this.position);
    if (!fullscreen) {
      style.display = 'flex';
      switch (this.position) {
        case 'top':
          style.flexDirection = 'column';
          style.justifyContent = 'flex-start';
          break;
        case 'left':
          style.flexDirection = 'row';
          style.justifyContent = 'flex-start';
          break;
        case 'right':
          style.flexDirection = 'row';
          style.justifyContent = 'flex-end';
          break;
        case 'bottom':
          style.flexDirection = 'column';
          style.justifyContent = 'flex-end';
          break;
        default:
      }
    }
    return style;
  }

  private get contentStyle(): Record<string, string> {
    const style: Record<string, string> = {
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
    };
    if (!this.fullscreen) {
      switch (this.position) {
        case 'top':
          delete style.bottom;
          style.height = 'max-content';
          break;
        case 'left':
          delete style.right;
          style.width = 'max-content';
          break;
        case 'right':
          delete style.left;
          style.width = 'max-content';
          break;
        case 'bottom':
          delete style.top;
          style.height = 'max-content';
          break;
        case 'center':
          delete style.right;
          delete style.bottom;
          style.top = '50%';
          style.left = '50%';
          style.width = 'max-content';
          style.height = 'max-content';
          style.transform = 'translate(-50%, -50%)';
          break;
        default:
      }
    }
    return style;
  }

  @commonBusModule.Mutation(COMMON.SET_BODY_SCROLLABLE)
  private readonly setBodyScrollable: ExtractModuleMutation<StoreCommonBusModule, COMMON.SET_BODY_SCROLLABLE>;

  @commonBusModule.Mutation(COMMON.REMOVE_BODY_SCROLLABLE)
  private readonly removeBodyScrollable: ExtractModuleMutation<StoreCommonBusModule, COMMON.REMOVE_BODY_SCROLLABLE>;

  @Watch('value')
  protected onValueChange(value, old): void {
    if (value === old) {
      return;
    }
    if (value) {
      this.show();
    } else {
      this.hide();
    }
  }

  @Watch('visible')
  protected onVisibleChange(visible, old): void {
    if (visible === old) {
      return;
    }
    this.$emit('input', visible);
    this.$emit('on-change', visible);
  }

  private clearAnimation(): void {
    if (!this.timerAnimation) {
      return;
    }
    clearTimeout(this.timerAnimation);
    this.timerAnimation = 0;
  }

  private handlerShowAnimation(): void {
    this.animation = 'show';
    this.opacity = 1;
    this.timerAnimation = 0;
  }

  private show(): void {
    if (this.animation === 'hiding') {
      this.clearAnimation();
      this.handlerShowAnimation();
    }
    if (this.visible) {
      return;
    }
    this.animation = 'showing';
    this.clearAnimation();
    this.opacity = 0;
    this.created = true;
    this.visible = true;
    this.timerAnimation = window.setTimeout(this.handlerShowAnimation, 50);
    this.setBodyScrollable({ id: this._uid, value: false });
  }

  private handlerHideAnimation(): void {
    this.animation = 'hide';
    this.visible = false;
    this.removeBodyScrollable({ id: this._uid });
    this.timerAnimation = 0;
  }

  private hide(): void {
    if (this.animation === 'showing') {
      this.clearAnimation();
      this.handlerHideAnimation();
    }
    if (!this.visible) {
      return;
    }
    this.animation = 'hiding';
    this.clearAnimation();
    this.opacity = 0;
    this.timerAnimation = window.setTimeout(this.handlerHideAnimation, 300);
  }

  private maskClick(e: MouseEvent): void {
    if (e.target !== this.$refs.$main && e.target !== this.$refs.$mask) {
      return;
    }
    if (this.maskClosable) {
      e.preventDefault();
      e.stopPropagation();
      this.hide();
    }
    this.$emit('mask-click');
  }

  private contentClick(e: MouseEvent): void {
    if (!this.fullscreen) {
      return;
    }
    if (e.target !== this.$refs.$content) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.maskClick(e);
  }

  public mounted(): void {
    if (this.value) {
      this.show();
    }
  }

  public beforeDestroy(): void {
    this.removeBodyScrollable({ id: this._uid });
  }

  public render(): VNode | null {
    if (this.created) {
      return <div class={styles.popup} style="display: none;">
        <portal to="application-outlet">
          {
            this.noMask
              ? null
              : <div
                v-show={this.visible}
                v-prevent-overscroll
                ref="$mask"
                class={styles['popup-mask']}
                style={{ opacity: this.opacity * this.maskOpacity, zIndex: this.zIndex }}
                onClick={this.maskClick}
              >
                { this.$slots.mask }
              </div>
          }
          <div
            v-show={this.visible}
            v-prevent-overscroll
            ref="$main"
            class={styles['popup-main']}
            style={this.transformStyle}
            onClick={this.maskClick}
          >
            <div ref="$content" class={styles['popup-content']} style={this.contentStyle} onClick={this.contentClick}>
              { this.$slots.default }
            </div>
          </div>
        </portal>
      </div>;
    }
    return null;
  }
}
