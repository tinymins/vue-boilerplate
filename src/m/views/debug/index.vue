<template>
  <div>
    <p>移动端</p>
    <p v-for="i in 4">
      <mt-button @click="debugLogin('debug' + i)">设置用户debug{{ i }}</mt-button>
    </p>
<!--     <p>
      <mt-button @click="debugLogin('debug2')">设置用户debug2</mt-button>
    </p> -->
    <a href="https://dev.haimanchajian.com/debug.php/site/debug-mock?id=4">Safari点此先设置cookie</a>
    <p v-if="user">
      当前用户：{{ user.name }}
    </p>
    <p v-else>
      当前没用户
    </p>
    <p class="rem75">750px</p>
    <p class="rem64">640px</p>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters('user', ['user']),
    },
    methods: {
      ...mapActions('user', {
        getUser: 'USER_DEBUG',
      }),
      debugLogin(phone) {
        const data = {
          code: 'code',
          phone,
        };
        this.getUser(data);
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
