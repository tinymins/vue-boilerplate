<template>
  <div>
    <!-- <link v-transfer-dom rel="stylesheet" type="text/css" href="//at.alicdn.com/t/font_xxxx.css"> -->
    <div v-transfer-dom class="safe-area-insets left" :style="{ width: `${viewportLeft}px` }"></div>
    <div v-transfer-dom class="safe-area-insets right" :style="{ width: `${viewportRight}px` }"></div>
    <div v-transfer-dom class="safe-area-insets top" :style="{ height: `${viewportTop}px` }"></div>
    <div v-transfer-dom class="safe-area-insets bottom" :style="{ height: `${viewportBottom}px` }"></div>
    <div v-transfer-dom v-if="user" class="user-id" :style="{ bottom: `${viewportBottom}px` }">#{{ user.id.toString(16) }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TransferDom from '@/directives/transfer-dom';

export default {
  directives: {
    TransferDom,
  },
  computed: {
    ...mapState('common', [
      'viewportTop',
      'viewportRight',
      'viewportBottom',
      'viewportLeft',
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/common/static/index.scss';
</style>
