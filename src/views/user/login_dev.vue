<template>
  <div>
    <p>测试登录</p>
    <p v-for="i in 4" :key="i">
      <cube-button @click="debugLogin('debug' + i)">设置用户debug{{ i }}</cube-button>
    </p>
    <a href="https://dev.haimanchajian.com/debug.php/site/debug-mock?id=4">Safari点此先设置cookie</a>
    <p class="rem75">750px</p>
    <p class="rem64">640px</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Button } from 'cube-ui';
import { USER } from '@/store/types';

export default {
  uses: [
    Button,
  ],
  computed: {
    ...mapGetters('user', ['user']),
  },
  methods: {
    ...mapActions('user', {
      login: USER.LOGIN,
    }),
    debugLogin(phone) {
      const data = {
        phone,
        code: 'code',
      };
      this.login(data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/user/login_dev.scss';
</style>
