<template>
  <div>
    <mt-loadmore :top-method="loadTop" ref="loadmore">
    <ul
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
    >
      <router-link
        tag="li"
        v-for="item in list"
        :key="item.iid"
        :to="{ name: 'secret_posts', params: { id: item.id } }"
      >
        {{ item.content }}
      </router-link>
    </ul>
    </mt-loadmore>
  </div>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';

  export default {
    mounted() {
      this.$nextTick(() => {
        window.scrollTo(0, this.scroll);
        // this.saveScroll(); // clear
        document.addEventListener('scroll', this.recordScroll, true);
      });
    },
    beforeDestroy() {
      document.removeEventListener('scroll', this.recordScroll, true);
    },
    computed: {
      ...mapState('secret', ['list', 'scroll']),
    },
    methods: {
      ...mapActions('secret', {
        getPosts: 'SECRET_LIST_REQUEST',
      }),
      ...mapMutations('secret', {
        saveScroll: 'SECRET_SAVE_SCROLL',
      }),
      recordScroll() {
        this.saveScroll(document.body.scrollTop);
      },
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
        if (reload) {
          this.saveScroll(); // clear
        }
        return this.getPosts(data);
      },
    },
  };
</script>
