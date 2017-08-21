<template>
  <header>
    <div class="nav-wrapper">
      <el-menu class="nav" :default-active="selected" mode="horizontal" router>
        <el-menu-item
          v-for="(tab, index) of tabList" :key="tab.route"
          :index="tab.route"
          :route="{ name: tab.route }"
        >
          <router-link style="text-decoration: none" :to="tab.route">{{ tab.name }}</router-link>
        </el-menu-item>
      </el-menu>
    </div>
  </header>
</template>

<script>
  import { isDevelop } from '@/utils/util';

  export default {
    methods: {},
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

<style lang="scss" scoped>
.nav-wrapper {
  background-color: #eef1f6;
}
.nav {
  margin: 0 auto;
  max-width: 960px;
}
</style>
