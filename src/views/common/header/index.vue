<template>
  <div
    class="header-wrapper"
    v-show="visible"
    :style="{ height: `${height}px` }"
  >
    <div
      v-transfer-dom
      v-show="isInWebAppiOS() && visible"
      class="header-web-app-status-bar"
    ></div>
    <div
      v-show="visible"
      ref="$navbar"
      class="navbar"
      :class="{ 'web-app': isInWebAppiOS() }"
    >
      <div class="navbar__hd" @click="back">
        <a class="navbar__back">返回</a>
        <div class="navbar__arrow"></div>
      </div>
      <div class="navbar__bd">{{ title }}</div>
      <div class="navbar__ft" @click="actionsheet">
        <a class="navbar__more"></a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import { isProdhost, isInWebAppiOS } from '@/utils/environment';
import TransferDom from '@/directives/transfer-dom';

export default {
  directives: {
    TransferDom,
  },
  data() {
    return {
      titleCache: {},
    };
  },
  computed: {
    ...mapState('common', { visible: 'navbarVisible', title: 'navbarTitle' }),
    ...mapGetters('common', { height: 'headerHeight' }),
  },
  mounted() {
    this.onresize();
    this.updateHeaderHeight();
    window.addEventListener('resize', this.onresize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onresize);
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
  methods: {
    isInWebAppiOS,
    ...mapMutations('common', {
      setHeaderHeight: 'COMMON_SET_HEADER_HEIGHT',
    }),
    back() {
      if (this.$router) {
        this.$router.back();
      } else {
        window.history.back();
      }
    },
    actionsheet() {
      const menu = [
        { id: 'index', content: '返回首页' },
      ];
      if (!isProdhost()) {
        menu.push({ id: 'debug', content: 'Debug' });
      }
      this.$createActionSheet({
        title: '',
        data: menu,
        onSelect: this.actionsheetHandler,
      }).show();
    },
    actionsheetHandler({ id }) {
      if (id === 'debug') {
        this.$router.push({ name: 'user_login_dev' });
      } else if (id === 'index') {
        this.$router.push({ name: 'secret' });
      }
    },
    updateHeaderHeight() {
      const $navbar = this.$refs.$navbar;
      const clientHeight = $navbar.clientHeight;
      const marginTop = parseFloat(getComputedStyle($navbar).marginTop);
      const marginBottom = parseFloat(getComputedStyle($navbar).marginBottom);
      const borderTopWidth = parseFloat(getComputedStyle($navbar).borderTopWidth);
      const borderBottomWidth = parseFloat(getComputedStyle($navbar).borderBottomWidth);
      this.setHeaderHeight(clientHeight + marginTop + marginBottom + borderTopWidth + borderBottomWidth);
    },
    onresize() {
      setTimeout(this.updateHeaderHeight, 300);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~styles/views/common/header/index.scss';
</style>
