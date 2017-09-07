<template>
  <div class="user">
    <div>me on mobile</div>
    <p v-if="user">
      当前用户：{{ user.name }}
    </p>
    <mt-button @click="logout">
      Logout
    </mt-button>

  </div>
</template>
<script>
import { Button } from 'mint-ui';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    [Button.name]: Button,
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  methods: {
    ...mapActions('user', {
      actionLogout: 'USER_LOGOUT',
    }),
    logout() {
      this.actionLogout();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/views/user/index.scss';
</style>
