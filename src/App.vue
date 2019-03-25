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
import { getElementPath, safeCall } from '@/utils/util';
import { isInMobileDevice } from '@/utils/environment';
import safeAreaInsets from 'safe-area-insets';

export default {
  computed: {
    ...mapState('common', [
      'loading',
      'loadings',
      'toast',
      'toasts',
      'dialogs',
      'actionsheet',
      'actionsheets',
      'viewportTop',
      'viewportRight',
      'viewportBottom',
      'viewportLeft',
      'bodyScrollable',
      'bodyAutoHeight',
    ]),
    ...mapGetters('common', ['headerHeight', 'footerHeight']),
    dialog() {
      return this.dialogs[0];
    },
  },
  watch: {
    loading() {
      this.updateToast();
    },
    toast() {
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
    actionsheet() {
      if (this.actionsheet) {
        console.warn('unhandled actionsheet!', this.actionsheet);
        this.popActionsheet();
      }
    },
  },
  mounted() {
    if (isInMobileDevice()) {
      safeAreaInsets.onChange(this.onresize);
      // disable zoom
      window.addEventListener('gesturestart', (e) => {
        e.preventDefault();
      });
      window.addEventListener('touchmove', (e) => {
        const event = e.originalEvent || e;
        if (event.scale && event.scale !== 1) {
          event.preventDefault();
        }
      }, { capture: true, passive: false, once: false });
      // disable selection
      if (typeof document.body.onselectstart !== 'undefined') {
        document.body.onselectstart = e => this.isTagSelectable(e.target);
      }
      if (typeof document.body.style.mozUserSelect !== 'undefined') {
        document.body.style.mozUserSelect = 'none';
      }
      document.body.onmousedown = e => this.isTagSelectable(e.target);
      // disable wechat context menu
      document.body.oncontextmenu = e => !getElementPath(e.target)
        .some($dom => $dom.attributes && $dom.attributes['disable-context-menu']);
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
      popToast: COMMON.POP_TOAST,
      popActionsheet: COMMON.POP_ACTIONSHEET,
      setViewportSize: COMMON.SET_VIEWPORT_SIZE,
    }),
    isTagSelectable(element) {
      return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || getElementPath(element)
        .some($dom => $dom.attributes && $dom.attributes['allow-user-select']);
    },
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
            this.popToast();
            this.updateToast();
          }, 300);
          this.currentToast = this.toast;
        }
      } else if (this.loading) {
        if (this.currentToast !== this.loading) {
          const text = this.loadings.concat([this.loading])
            .map(c => c.text).filter(_ => _).join(' | ');
          console.warn('unhandled toast!', this.toast, text);
          this.currentToast = this.loading;
        }
      } else if (this.insToast) {
        console.warn('unhandled toast hide!');
        this.insToast = null;
      }
    },
    onresize() {
      setTimeout(this.updateHeaderSize, 300);
    },
  },
};
</script>
