/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { VNode } from 'vue';
import { namespace } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
import Option from '@/decorators/option';
import { getAuthorizeURL } from '@/utils/authorization';
import { isLocalhost, isInWechat } from '@/utils/environment';
import { StoreCommonAppState } from '@/store/common/app';
// import styles from '@/styles/views/user/login.module.scss';

const commonAppModule = namespace('common/app');

@Component
export default class LoginPage extends Vue {
  @Option(true) protected static hideTabbar;
  @Option(false) protected static bodyAutoHeight;

  @commonAppModule.State private readonly entryParams!: StoreCommonAppState['entryParams'];

  protected mounted(): void {
    const useWechatAuth = !isLocalhost(this.entryParams.hostname) && isInWechat(this.entryParams.userAgent);
    if (useWechatAuth) {
      const to = this.$routeInfo.query.to
        ? this.$router.resolve(this.$routeInfo.query.to)
        : null;
      const redirect = getAuthorizeURL(this.entryParams, 'wx', 'login', to);
      if (redirect) {
        window.location.href = redirect;
      }
    }
  }

  public render(): VNode {
    return <div>
      user/login
      <router-link to={{ name: 'user_login_dev', query: this.$route.query }}>To Dev Login</router-link>
    </div>;
  }
}
