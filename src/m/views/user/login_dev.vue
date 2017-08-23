<template>
  <div>
    <p>移动端</p>
    <p v-for="i in 4" :key="i">
      <mt-button @click="debugLogin('debug' + i)">设置用户debug{{ i }}</mt-button>
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
  import { mapGetters, mapActions } from 'vuex';
  import { Button } from 'mint-ui';

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
        getUser: 'USER_GET',
      }),
      debugLogin(name) {
        this.login({ name, code: 'code' }).then(() => this.getUser(true));
      },
    },
    watch: {
      user(user) {
        if (user) {
          this.$router.push({ name: 'user_index' });
        }
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
