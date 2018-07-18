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
      if (this.loading) {
        const text = this.loadings.concat([this.loading])
          .map(c => c.text).filter(_ => _).join(' | ');
        if (!this.insLoading) {
          this.insLoading = this.$createToast({
            txt: text,
            time: 0,
            mask: true,
            type: 'loading',
          });
          this.insLoading.show();
        } else {
          this.insLoading.text = text;
        }
      } else if (this.insLoading) {
        this.insLoading.hide();
        this.insLoading = null;
      }
    },
    toast() {
      if (this.toast) {
        this.$createToast({
          txt: this.toast.text,
          time: this.toast.time,
          mask: true,
          type: this.toast.type === 'warning' ? 'warn' : this.toast.type,
          onTimeout: () => this.popToast(),
        }).show();
      }
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
    onresize() {
      setTimeout(this.updateHeaderSize, 300);
    },
  },
};
</script>

<style>

</style>
