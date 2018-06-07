<template>
  <div class="footer-wrapper">
    <div class="footer">
      <div
        v-for="tab of tabList" :key="tab.route"
        class="footer-item"
        @click="$router.push({ name: tab.route })"
      >
        <img slot="icon" :src="tab.img">
        {{ tab.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const tabList = [
      { name: '首页', route: 'index', img: 'assets/100x100.png' },
      { name: '消息', route: 'msg', img: 'assets/100x100.png' },
      { name: '秘密', route: 'secret', img: 'assets/100x100.png' },
      { name: '我的', route: 'user', img: 'assets/100x100.png' },
    ];
    return {
      tabList,
    };
  },
  computed: {
    selected: {
      set(name) {
        this.$router.push({ name });
      },
      get() {
        let active = this.$route.nav;
        Object.values(this.$route.matched).forEach((obj) => {
          if (obj.meta.nav) {
            active = obj.meta.nav;
          }
        });
        return active;
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~m/styles/views/common/footer/index.scss';
</style>
