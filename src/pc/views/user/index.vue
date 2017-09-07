<template>
  <div>
    <div>me on pc</div>
    <p v-if="user">
      当前用户：{{ user.name }}
    </p>
    <el-button @click="logout">Logout</el-button>
  </div>
</template>
<script>
import { Button } from 'element-ui';
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
