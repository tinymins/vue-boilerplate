<template>
  <div>
    {{ content }}
    <router-link :to="{ name: 'secret' }">back</router-link>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { setWechatTitle } from '@/utils/util';

  export default {
    data() {
      return {
        content: {},
      };
    },
    mounted() {
      this.getPosts(this.$route.params.id).then((data) => {
        this.content = data;
        setWechatTitle(data.content);
      }).catch((err) => {
        if (err.response.status >= 400) {
          this.$router.push({ name: '404' });
        }
      });
    },
    beforeDestroy() {
      // document.removeEventListener('scroll', this.event);
    },
    methods: {
      ...mapActions('secret', {
        getPosts: 'SECRET_POSTS',
      }),
    },
  };
</script>
