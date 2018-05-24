<template>
  <div>
    <p>移动端</p>
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

export default {
  components: {
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
