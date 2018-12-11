<template>
  <div>
    <p>测试登录</p>
    <p v-for="i in 4" :key="i">
      <button @click="debugLogin('debug' + i)">设置用户debug{{ i }}</button>
    </p>
    <a href="https://dev.haimanchajian.com/debug.php/site/debug-mock?id=4">Safari点此先设置cookie</a>
    <p class="rem75">750px</p>
    <p class="rem64">640px</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
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
