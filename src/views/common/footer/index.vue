<template>
  <div class="footer">
    <div class="tabbar" :style="{ bottom: `${viewportBottom}px` }">
      <div
        v-for="tab of tabList" :key="tab.route"
        class="tabbar-item"
        :class="{ actived: selected === tab.name || tab.static }"
        @click="$router.push({ name: tab.route })"
      >{{ tab.name }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    const tabList = [
      { name: 'index', text: '首页', route: 'index' },
      { name: 'user', text: '我的', route: 'user' },
    ];
    return {
      tabList,
    };
  },
  computed: {
    ...mapState('common', ['viewportBottom']),
    selected: {
      set(name) {
        this.$router.push({ name });
      },
      get() {
        let name = this.$route.name;
        Object.values(this.$route.matched).forEach((r) => {
          if (r.meta.tabbar) {
            name = r.meta.tabbar.replace(/[^/]+\//u, '');
          }
        });
        return name;
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~styles/views/common/footer/index.scss';
</style>
