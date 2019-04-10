<template>
  <transition name="fade" mode="out-in">
    <div
      class="app"
      :style="{
        height: bodyAutoHeight ? null : '100%',
        display: bodyAutoHeight ? null : 'flex',
        flexDirection: bodyAutoHeight ? null : 'column',
        boxSizing: bodyAutoHeight ? null : 'border-box',
        overflow: bodyScrollable ? null : 'hidden',
        padding: `${headerHeight}px ${viewportRight}px ${footerHeight}px ${viewportLeft}px`,
      }"
    >
      <router-view name="static"></router-view>
      <router-view name="header" :style="{ flex: bodyAutoHeight ? null : '0 0 auto' }"></router-view>
      <router-view name="main" :style="{ flex: bodyAutoHeight ? null : '1 1 auto' }"></router-view>
      <router-view name="footer" :style="{ flex: bodyAutoHeight ? null : '0 0 auto' }"></router-view>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import { COMMON } from '@/store/types';
import { safeCall } from '@/utils/util';
import { isInMobileDevice } from '@/utils/environment';
import safeAreaInsets from 'safe-area-insets';

const TOAST_TYPE_MAP = {
  success: 'correct',
  warning: 'warn',
};

export default {
  computed: {
    ...mapState('common', [
      'loadings',
      'toasts',
      'dialogs',
      'actionsheets',
      'viewportTop',
      'viewportRight',
      'viewportBottom',
      'viewportLeft',
      'bodyScrollable',
      'bodyAutoHeight',
    ]),
    ...mapGetters('common', ['headerHeight', 'footerHeight']),
    loading() {
      return this.loadings[0];
    },
    toast() {
      return this.toasts[0];
    },
    dialog() {
      return this.dialogs[0];
    },
    actionsheet() {
      return this.actionsheets[0];
    },
  },
  watch: {
    loading(loading, old) {
      if (loading === old) {
        return;
      }
      this.updateToast();
    },
    toast(toast, old) {
      if (toast === old) {
        return;
      }
      this.updateToast();
    },
    dialog(dialog, old) {
      if (dialog === old) {
        return;
      }
      if (old && old.onclose) {
        safeCall(old.onclose);
      }
      if (this.insDialog) {
        this.insDialog.hide();
        this.insDialog = null;
      }
      if (dialog) {
        const type = dialog.type || (dialog.buttons.length === 2 ? 'confirm' : 'alert');
        let cancelBtn, confirmBtn;
        if ((type === 'confirm' && dialog.buttons.length === 1) || type === 'alert') {
          confirmBtn = dialog.buttons[0];
        } else {
          cancelBtn = dialog.buttons[0];
          confirmBtn = dialog.buttons[1];
        }
        this.insDialog = this.$createDialog({
          type,
          title: dialog.title,
          content: dialog.content,
          confirmBtn: confirmBtn
            ? {
              text: confirmBtn.label,
              active: confirmBtn.primary,
            }
            : null,
          onConfirm: () => {
            if (confirmBtn && confirmBtn.action) {
              safeCall(confirmBtn.action);
            }
            this.$hideDialog(dialog);
          },
          cancelBtn: cancelBtn
            ? {
              text: cancelBtn.label,
              active: cancelBtn.primary,
            }
            : null,
          onCancel: () => {
            if (cancelBtn && cancelBtn.action) {
              safeCall(cancelBtn.action);
            }
            this.$hideDialog(dialog);
          },
          onClose: () => {
            if (dialog.onclose) {
              safeCall(dialog.onclose);
            }
            this.$hideDialog(dialog);
          },
        }).show();
      }
    },
    actionsheet(actionsheet) {
      if (actionsheet) {
        this.insActionsheet = this.$createActionSheet({
          title: actionsheet.title,
          data: actionsheet.data,
          onSelect: (...args) => {
            safeCall(actionsheet.handler, ...args);
            this.$hideActionsheet(actionsheet);
          },
          onCancel: () => this.$hideActionsheet(actionsheet),
        });
        this.insActionsheet.show();
      } else if (this.insActionsheet) {
        this.insActionsheet.hide();
        this.insActionsheet = null;
      }
    },
  },
  mounted() {
    if (isInMobileDevice()) {
      safeAreaInsets.onChange(this.onresize);
    }
    this.onresize();
    this.updateHeaderSize();
    window.addEventListener('resize', this.onresize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onresize);
  },
  methods: {
    ...mapMutations('common', {
      setViewportSize: COMMON.SET_VIEWPORT_SIZE,
    }),
    updateHeaderSize() {
      this.setViewportSize({
        top: safeAreaInsets.top,
        bottom: safeAreaInsets.bottom,
        left: safeAreaInsets.left,
        right: safeAreaInsets.right,
        width: window.innerWidth - safeAreaInsets.left - safeAreaInsets.right,
        height: window.innerHeight - safeAreaInsets.top - safeAreaInsets.bottom,
      });
    },
    updateToast() {
      if (this.toast) {
        if (this.currentToast !== this.toast) {
          this.insToast = this.$createToast({
            txt: this.toast.text,
            time: this.toast.time,
            mask: true,
            type: TOAST_TYPE_MAP[this.toast.type] || this.toast.type,
            onTimeout: () => {
              this.$hideToast(this.toast);
            },
          });
          this.insToast.show();
          this.currentToast = this.toast;
        }
      } else if (this.loading) {
        if (this.currentToast !== this.loading) {
          const text = this.loadings.map(c => c.text).filter(_ => _).join(' | ');
          this.insToast = this.$createToast({
            txt: text,
            time: 0,
            mask: true,
            type: 'loading',
          });
          this.insToast.show();
          this.currentToast = this.loading;
        }
      } else if (this.insToast) {
        this.insToast.hide();
        this.insToast = null;
      }
    },
    onresize() {
      setTimeout(this.updateHeaderSize, 300);
    },
  },
};
</script>
