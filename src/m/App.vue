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
        this.$createDialog({
          title: this.message.title,
          content: this.message.content,
          onConfirm: () => this.popMessage(),
          onCancel: () => this.popMessage(),
          onClose: () => this.popMessage(),
        }).show();
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
          this.insToast = this.$createToast({
            txt: this.toast.text,
            time: this.toast.time,
            mask: true,
            type: this.toast.type === 'warning' ? 'warn' : this.toast.type,
            onTimeout: () => {
              this.popToast();
              this.updateToast();
            },
          });
          this.insToast.show();
          this.currentToast = this.toast;
        }
      } else if (this.loading) {
        if (this.currentToast !== this.loading) {
          const text = this.loadings.concat([this.loading])
            .map(c => c.text).filter(_ => _).join(' | ');
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

<style>

</style>
