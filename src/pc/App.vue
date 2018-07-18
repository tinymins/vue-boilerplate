<template>
  <transition name="fade" mode="out-in">
    <div class="body-wrapper">
      <router-view name="header"></router-view>
      <router-view name="main" class="main"></router-view>
      <router-view name="footer"></router-view>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { Loading, Message, MessageBox } from 'element-ui';

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
          this.insLoading = Loading.service({
            lock: true,
            text,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
          });
        } else {
          this.insLoading.text = text;
        }
      } else if (this.insLoading) {
        this.insLoading.close();
        this.insLoading = null;
      }
    },
    toast() {
      if (this.toast) {
        Message({
          message: this.toast.text,
          type: this.toast.type,
          duration: this.toast.time,
          onClose: () => this.popToast(),
        });
      }
    },
    message() {
      if (this.message) {
        MessageBox({
          title: this.message.title,
          message: this.message.content,
          callback: () => this.popMessage(),
        });
      }
    },
  },
  mounted() {
    this.onresize();
    this.updateViewportSize();
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
    updateViewportSize() {
      this.setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    },
    onresize() {
      setTimeout(this.updateViewportSize, 300);
    },
  },
};
</script>

<style>

</style>
