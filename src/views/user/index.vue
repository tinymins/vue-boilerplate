<template>
  <div class="user">
    <div>me</div>
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
      actionLogout: USER.LOGOUT,
    }),
    logout() {
      this.actionLogout();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/user/index.scss';
</style>
