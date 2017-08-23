<template>
  <div class="view">
    <el-tabs v-model="active">
      <el-tab-pane label="测试1" name="1">
        <ul class="list">
          <router-link class="list-item" tag="li" v-for="item in list" :key="item.iid" :to="{ name: 'secret_posts', params: { id: item.id } }">
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
      </el-tab-pane>
      <el-tab-pane v-for="n in ['2', '3', '4']" :key="n" :label="`测试${n}`" :name="n">
        测试{{ n }}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import { setWechatTitle } from '@/utils/util';
  import { TabPane, Tabs } from 'element-ui';

  export default {
    components: {
      [Tabs.name]: Tabs,
      [TabPane.name]: TabPane,
    },
    data() {
      return {
        active: '1',
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
        this.loadList(true);
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
      recordScroll() {
        this.saveScroll(document.body.scrollTop);
      },
      loadMore() {
        if (this.active === '1') this.loadList();
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
        if (val === '1') {
          this.loadList(true);
        }
        window.scrollTo(0, 0);
        setWechatTitle(`秘密列表${val}`);
      },
    },
  };
</script>

<style lang="scss" scoped>
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
