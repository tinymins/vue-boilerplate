<template>
  <div class="menu">
    <el-button @click="popupUser" type="primary" class="menu-item">User center</el-button>
  </div>
</template>
<script>
import { Button } from 'element-ui';
import { popupWindow } from '@/utils/chrome-ext';

export default {
  components: {
    [Button.name]: Button,
  },
  methods: {
    popupUser() {
      popupWindow('index.html#/user', true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~pc/styles/views/popup/index.scss';
</style>
