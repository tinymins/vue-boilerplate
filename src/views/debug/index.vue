<template>
  <div>

    <p>
      <mt-button @click="debugLogin('debug1')">获取用户debug1</mt-button>
    </p>
    <p>
      <mt-button @click="debugLogin('debug2')">获取用户debug2</mt-button>
    </p>
    <p v-if="user">
      当前用户：{{ user.name }}
    </p>
    <p v-else>
      当前没用户
    </p>
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
