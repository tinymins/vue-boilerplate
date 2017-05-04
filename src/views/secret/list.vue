<template>
  <div>
    <mt-loadmore :top-method="loadTop" ref="loadmore">
    <ul
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
    >
      <li v-for="item in list">{{ item.content }}</li>
    </ul>
    </mt-loadmore>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    data() {
      return {
        event: null,
      };
    },
    mounted() {
      // this.loadList(true);
      // this.event = document.addEventListener('scroll', (event) => {
      //   // save scroll point
      //   // commit vuex store
      //   console.log(event);
      // }, false);
    },
    beforeDestroy() {
      // document.removeEventListener('scroll', this.event);
    },
    computed: {
      ...mapState('secret', ['list']),
    },
    methods: {
      ...mapActions('secret', {
        getPosts: 'SECRET_LIST_REQUEST',
      }),
      loadTop() {
        this.loadList(true).then(() => {
          this.$refs.loadmore.onTopLoaded();
        }).catch(() => {
          this.$refs.loadmore.onTopLoaded();
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
