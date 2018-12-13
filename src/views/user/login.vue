<template>
  <div>user/login</div>
</template>
<script>
import { getAuthorizeURL } from '@/utils/authorization';
import { isLocalhost, isInWechat } from '@/utils/environment';

export default {
  options: {
    hideTabbar: true,
    bodyAutoHeight: false,
  },
  mounted() {
    const useWechatAuth = !isLocalhost() && isInWechat();
    if (useWechatAuth) {
      const to = this.$route.query.to
        ? this.$router.resolve(this.$route.query.to) : null;
      const redirect = getAuthorizeURL('wx', 'login', to);
      if (redirect) {
        window.location = redirect;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/user/login.scss';
</style>
