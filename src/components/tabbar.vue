<template>
    <footer>
    <mt-tabbar v-model="selected">
      <mt-tab-item :id="tab.route" v-for="tab of tabList" :key="tab.route">
        <img slot="icon" :src="tab.img">
        {{ tab.name }}
      </mt-tab-item>
    </mt-tabbar>
  </footer>
</template>

<script>
  import { isDevelop } from '@/utils/util';

  export default {
    data() {
      const tabList = [
        { name: '首页', route: 'home', img: 'assets/100x100.png' },
        { name: '消息', route: 'msg', img: 'assets/100x100.png' },
        { name: '秘密', route: 'secret', img: 'assets/100x100.png' },
        { name: '我的', route: 'me', img: 'assets/100x100.png' },
      ];
      if (isDevelop()) {
        tabList.push({ name: 'debug', route: 'debug', img: 'assets/100x100.png' });
      }
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
          let active = this.$route.name;
          Object.values(this.$route.matched).forEach((obj) => {
            if (obj.meta.parent) {
              active = obj.meta.parent;
            }
          });
          return active;
        },
      },
    },
  };
</script>
