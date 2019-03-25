<template>
  <div class="user">
    <div>me</div>
    <p v-if="user">
      当前用户：{{ user.name }}
    </p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { USER } from '@/store/types';

export default {
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
