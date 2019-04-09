<template>
  <div class="menu">
    <template v-if="mounted">
      <button @click="popupUser" type="primary" class="menu-item">User center</button>
    </template>
  </div>
</template>
<script>
import { popupWindow } from '@/utils/chrome-ext';

export default {
  data() {
    return {
      mounted: false,
    };
  },
  mounted() {
    window.addEventListener('resize', this.startRender);
    this.timerRender = window.setTimeout(this.startRender, 50);
  },
  methods: {
    popupUser() {
      popupWindow('index.html#/user', true);
    },
    startRender() {
      if (this.timerRender) {
        clearTimeout(this.timerRender);
        delete this.timerRender;
      }
      this.mounted = true;
      window.removeEventListener('resize', this.onMounted);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/popup/index.scss';
</style>
