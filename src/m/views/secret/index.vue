<template>
  <div class="view">
    <nav class="nav">
      <div
        v-for="n in 4" :key="n"
        class="nav-item"
        :class="{ 'nav-item--active': active == n }"
        @click="onSelectNav(n)"
      >测试{{ n }}</div>
    </nav>
    <cube-scroll class="list">
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
    </cube-scroll>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { setWechatTitle } from '@/utils/util';
import { Scroll } from 'cube-ui';

export default {
  uses: {
    Scroll,
  },
  asyncData({ store }) {
    return store.dispatch('secret/SECRET_LIST_REQUEST', { filter: 'all' });
  },
  data() {
    return {
      active: 1,
      title: '海鳗列表',
      titles: ['第一', '第二', '第三', '第四'],
    };
  },
  computed: {
    ...mapState('secret', ['list', 'scroll']),
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
  height: 60px;
  top: 0;
  left: 0;
  z-index: 10;
  &-item {
    flex: 1;
    padding: 10px;
    line-height: 40px;
  }
  &-item--active {
    background: #ddd;
    color: #000;
    border-bottom: 2px solid #0ff;
  }
}
.view {
  padding: 60px 0 50px 0;
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
