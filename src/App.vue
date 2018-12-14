<template>
  <transition name="fade" mode="out-in">
    <div
      class="app"
      :style="{
        height: bodyAutoHeight ? null : '100%',
        overflow: bodyScrollable ? null : 'hidden',
        padding: `${viewportTop}px ${viewportRight}px ${viewportBottom}px ${viewportLeft}px`,
      }"
    >
      <router-view name="static"></router-view>
      <router-view name="header" style="flex: 0 0 auto;"></router-view>
      <router-view name="main" style="flex: 1 1 auto;"></router-view>
      <router-view name="footer" style="flex: 0 0 auto;"></router-view>
    </div>
  </transition>
</template>

<script>
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */
import { mapState, mapMutations } from 'vuex';
import { getElementPath } from '@/utils/util';
import { isInMobileDevice } from '@/utils/environment';
import safeAreaInsets from 'safe-area-insets';

export default {
  computed: {
    ...mapState('common', [
      'loading',
      'loadings',
      'toast',
      'toasts',
      'message',
      'messages',
      'actionsheet',
      'actionsheets',
      'viewportTop',
      'viewportRight',
      'viewportBottom',
      'viewportLeft',
      'bodyScrollable',
      'bodyAutoHeight',
    ]),
  },
  watch: {
    loading() {
      this.updateToast();
    },
    toast() {
      this.updateToast();
    },
    message() {
      if (this.message) {
        console.warn('unhandled message!', this.message);
        this.popMessage();
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
      } else if (typeof document.body.style.mozUserSelect !== 'undefined') {
        document.body.style.mozUserSelect = 'none';
      } else {
        document.body.onmousedown = e => this.isTagSelectable(e.target);
      }
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
      popToast: 'COMMON_POP_TOAST',
      popMessage: 'COMMON_POP_MESSAGE',
      popActionsheet: 'COMMON_POP_ACTIONSHEET',
      setViewportSize: 'COMMON_SET_VIEWPORT_SIZE',
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

<style lang="scss" scoped>
@import './styles/App.scss';
</style>
