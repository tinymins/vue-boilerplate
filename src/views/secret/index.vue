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
    <div class="list">
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
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { setWechatTitle } from '@/utils/util';

export default {
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
    ...mapState('secret', ['list']),
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
    setWechatTitle(`秘密列表${this.active}`);
  },
  methods: {
    ...mapActions('secret', {
      getPosts: 'SECRET_LIST_REQUEST',
    }),
    onSelectNav(n) {
      this.active = n;
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
      return this.getPosts(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  background: #eeeeee;
  text-align: center;
  color: #666666;
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
    background: #dddddd;
    color: #000000;
    border-bottom: 2px solid #00ffff;
  }
}

.view {
  padding: 60px 0 50px 0;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
  background: #eeeeee;

  &-item {
    padding: 10px;
    margin-bottom: 10px;
    background: #ffffff;
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
      border-top: 1px solid #eeeeee;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
