/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import Option from '@/decorators/option';
import { getAuthorizeURL } from '@/utils/authorization';
import { isLocalhost, isInWechat } from '@/utils/environment';
// import styles from '@/styles/views/user/login.module.scss';

@Component
export default class LoginPage extends Vue {
  @Option(true) protected static hideTabbar;
  @Option(false) protected static bodyAutoHeight;

  protected mounted(): void {
    const useWechatAuth = !isLocalhost() && isInWechat();
    if (useWechatAuth) {
      const to = this.$routeInfo.query.to
        ? this.$router.resolve(this.$routeInfo.query.to)
        : null;
      const redirect = getAuthorizeURL('wx', 'login', to);
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
