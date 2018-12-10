<template>
  <transition name="fade" mode="out-in">
    <div class="main">
      <router-view name="header"></router-view>
      <router-view name="main"></router-view>
      <router-view name="footer"></router-view>
    </div>
  </transition>
</template>

<script>
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState('common', ['loading', 'loadings', 'toast', 'toasts', 'message', 'messages']),
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
  },
  mounted() {
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
      setViewportSize: 'COMMON_SET_VIEWPORT_SIZE',
    }),
    updateHeaderSize() {
      this.setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
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

<style>

</style>
