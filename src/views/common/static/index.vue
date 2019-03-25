<template>
  <div>
    <div v-transfer-dom class="safe-area-insets left" :style="{ width: `${viewportLeft}px` }"></div>
    <div v-transfer-dom class="safe-area-insets right" :style="{ width: `${viewportRight}px` }"></div>
    <div v-transfer-dom class="safe-area-insets top" :style="{ height: `${viewportTop}px` }"></div>
    <div v-transfer-dom class="safe-area-insets bottom" :style="{ height: `${viewportBottom}px` }"></div>
    <div v-transfer-dom v-show="user" class="user-id" :style="{ bottom: `${viewportBottom}px` }">#{{ userId }}</div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState('common', [
      'viewportTop',
      'viewportRight',
      'viewportBottom',
      'viewportLeft',
    ]),
    ...mapGetters('user', ['user']),
    userId() {
      return this.user && this.user.id && this.user.id.toString(16);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/common/static/index.scss';
</style>
