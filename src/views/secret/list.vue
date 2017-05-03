<template>
  <div>
    <mt-loadmore :top-method="loadTop">
    <ul
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10">
      <li v-for="item in list">{{ item.content }}</li>
    </ul>
    </mt-loadmore>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    mounted() {
      // this.loadList(true);
    },
    computed: {
      ...mapState('secret', ['list', 'lock']),
    },
    methods: {
      ...mapActions('secret', {
        getPosts: 'SECRET_LIST_REQUEST',
      }),
      loadTop() {
        this.loadList(true).then(() => {
          this.$emit('onTopLoaded', 'load');
        }).catch(() => {
          this.$emit('onTopLoaded', 'load');
        });
      },
      loadMore() {
        this.loadList();
      },
      loadList(reload) {
        const data = {
          filter: 'all',
          reload,
        };
        return this.getPosts(data);
      },
    },
  };
</script>
