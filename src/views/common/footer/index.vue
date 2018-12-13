<template>
  <div class="footer">
    <div class="tabbar">
      <div
        v-for="tab of tabList" :key="tab.route"
        class="tabbar-item"
        @click="$router.push({ name: tab.route })"
      >{{ tab.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const tabList = [
      { name: '首页', route: 'index' },
      { name: '我的', route: 'user' },
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
@import '~styles/views/common/footer/index.scss';
</style>
