<template>
    <footer>
    <mt-tabbar v-model="selected" fixed>
      <mt-tab-item :id="tab.route" v-for="tab of tabList" :key="tab.route">
        <img slot="icon" :src="tab.img">
        {{ tab.name }}
      </mt-tab-item>
    </mt-tabbar>
  </footer>
</template>

<script>
  import { Tabbar, TabItem } from 'mint-ui';

  export default {
    components: {
      [Tabbar.name]: Tabbar,
      [TabItem.name]: TabItem,
    },
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
