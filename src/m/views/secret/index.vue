<template>
  <div class="view">
    <nav class="nav">
      <div v-for="n in 4" @click="onSelectNav(n)" :key="n" class="nav-item" :class="{ 'nav-item--active': active == n }">
        测试{{ n }}
      </div>
    </nav>
    <mt-tab-container v-model="active" :swipeable="true">
      <mt-tab-container-item :id="1">
        <mt-loadmore :top-method="loadTop" ref="loadmore">
        <ul
          class="list"
          v-infinite-scroll="loadMore"
          infinite-scroll-distance="100"
        >
          <router-link
            class="list-item"
            tag="li"
            v-for="item in list"
            :key="item.iid"
            :to="{ name: 'secret_posts', params: { id: item.id } }"
          >
            <div class="list-item__head">
              <img class="list-item__avatar">
              <div class="list-item__info">
                <div class="list-item__name">
                  <span v-html="item.user.name"></span>
                  <span class="list-item__level">API没给吧</span>
                </div>
                <div class="list-item__time">{{ item.time_point }}</div>
              </div>
            </div>
            <div class="list-item__content">
              {{ item.content }}
            </div>
            <div class="list-item__footer">
              <div class="list-item__views">{{ item.num_click }}</div>
              <div class="list-item__btns">管 赞 心</div>
            </div>
          </router-link>
        </ul>
        </mt-loadmore>
      </mt-tab-container-item>
      <mt-tab-container-item :id="2">
        <mt-cell v-for="n in 20" :key="n" title="tab-container 2"></mt-cell>
      </mt-tab-container-item>
      <mt-tab-container-item :id="3">
        <mt-cell v-for="n in 20" :key="n" title="tab-container 3"></mt-cell>
      </mt-tab-container-item>
      <mt-tab-container-item :id="4">
        <mt-cell v-for="n in 20" :key="n" title="tab-container 4"></mt-cell>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import { setWechatTitle } from '@/utils/util';
  import { Cell, TabContainer, TabContainerItem, Loadmore, InfiniteScroll } from 'mint-ui';

  export default {
    uses: {
      InfiniteScroll,
    },
    components: {
      [Cell.name]: Cell,
      [TabContainer.name]: TabContainer,
      [TabContainerItem.name]: TabContainerItem,
      [Loadmore.name]: Loadmore,
    },
    data() {
      return {
        active: 1,
        title: '海鳗列表',
      };
    },
    mounted() {
      this.$nextTick(() => {
        window.scrollTo(0, this.scroll);
        // this.saveScroll(); // clear
        document.addEventListener('scroll', this.recordScroll, true);

        document.body.ontouchmove = (e) => {
          e.stopPropagation();
        };
      });
      setWechatTitle(`秘密列表${this.active}`);
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
      onSelectNav(n) {
        this.active = n;
      },
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
        if (this.active === 1) this.loadList();
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
    watch: {
      active(val) {
        if (val === 1) {
          this.loadList(true);
        }
        window.scrollTo(0, 0);
        setWechatTitle(`秘密列表${val}`);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .nav {
    display: flex;
    background: #eee;
    text-align: center;
    color: #666;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    &-item {
      flex: 1;
      padding: 10px;
    }
    &-item--active {
      background: #ddd;
      color: #000;
      border-bottom: 2px solid #0ff;
    }
  }
  .view {
    padding: 40px 0 50px 0;
  }
  .list {
    margin: 0;
    padding: 0;
    list-style: none;
    background: #eee;
    &-item {
      padding: 10px;
      margin-bottom: 10px;
      background: #fff;
      // &:last-child {
      //   margin-bottom: 0;
      // }
      &__head {
        display: flex;
      }
      &__avatar {
        width: 40px;
        height: 40px;
        background: red;
      }
      &__info {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      &__content {
        margin: 10px 0;
      }
      &__footer {
        padding-top: 10px;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
