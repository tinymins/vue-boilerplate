<template>
  <div class="user">
    <div>me on mobile</div>
    <p v-if="user">
      当前用户：{{ user.name }}
    </p>
    <cube-button @click="logout">
      Logout
    </cube-button>

  </div>
</template>
<script>
import { Button } from 'cube-ui';
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
@import '~m/styles/views/user/index.scss';
</style>
