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
        this.$vux.loading.show({
          text: this.loadings.concat([this.loading])
            .map(c => c.text).filter(_ => _).join(' | '),
        });
      } else {
        this.$vux.loading.hide();
      }
    },
    toast() {
      if (this.toast) {
        this.$vux.toast.show({
          text: this.toast.text,
          time: this.toast.time,
          type: this.toast.type,
          width: this.toast.width,
          position: this.toast.position,
          onHide: () => this.popToast(),
        });
      } else {
        this.$vux.toast.hide();
      }
    },
    message() {
      if (this.message) {
        this.$vux.alert.show({
          title: this.message.title,
          content: this.message.content,
          onHide: () => this.popMessage(),
        });
      } else {
        this.$vux.alert.hide();
      }
    },
  },
  methods: {
    ...mapMutations('common', {
      popToast: 'COMMON_POP_TOAST',
      popMessage: 'COMMON_POP_MESSAGE',
    }),
  },
};
</script>

<style>

</style>
