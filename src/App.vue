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
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */
import { mapState, mapMutations, mapGetters } from 'vuex';
import { COMMON } from '@/store/types';
import { safeCall } from '@/utils/util';
import { isInMobileDevice } from '@/utils/environment';
import safeAreaInsets from 'safe-area-insets';

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
      if (dialog) {
        console.warn('unhandled dialog!', dialog);
        this.$hideDialog(dialog);
      }
    },
    actionsheet(actionsheet, old) {
      if (actionsheet === old) {
        return;
      }
      if (actionsheet) {
        console.warn('unhandled actionsheet!', actionsheet);
        this.$hideActionsheet(actionsheet);
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
          console.warn('unhandled toast!', this.toast);
          setTimeout(() => {
            this.$hideToast(this.toast);
          }, this.toast.time);
          this.currentToast = this.toast;
        }
      } else if (this.loading) {
        if (this.currentToast !== this.loading) {
          const text = this.loadings.map(c => c.text).filter(_ => _).join(' | ');
          console.warn('unhandled loading!', this.loading, text);
          this.currentToast = this.loading;
        }
      }
    },
    onresize() {
      setTimeout(this.updateHeaderSize, 300);
    },
  },
};
</script>
