<template>
  <div>
    <p>桌面版</p>
    <p v-for="i in 4" :key="i">
      <el-button @click="debugLogin('debug' + i)">设置用户debug{{ i }}</el-button>
    </p>
<!--     <p>
      <mt-button @click="debugLogin('debug2')">设置用户debug2</mt-button>
    </p> -->
    <a href="https://dev.haimanchajian.com/debug.php/site/debug-mock?id=4">Safari点此先设置cookie</a>
    <p class="rem75">750px</p>
    <p class="rem64">640px</p>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { Menu, MenuItem, Button } from 'element-ui';


  export default {
    components: {
      [Menu.name]: Menu,
      [MenuItem.name]: MenuItem,
      [Button.name]: Button,
    },
    computed: {
      ...mapGetters('user', ['user']),
    },
    methods: {
      ...mapActions('user', {
        login: 'USER_LOGIN',
      }),
      debugLogin(name) {
        const data = {
          name,
          code: 'code',
        };
        this.login(data);
      },
    },
  };
</script>
<style>
  .rem75 {
    width: 750px;
    background: red;
  }
  .rem64 {
    width: 640px;
    background: red;
  }
</style>
