<template>
  <div class="menu">
    <button @click="popupUser" type="primary" class="menu-item">User center</button>
  </div>
</template>
<script>
import { popupWindow } from '@/utils/chrome-ext';

export default {
  methods: {
    popupUser() {
      popupWindow('index.html#/user', true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/popup/index.scss';
</style>
