/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { type VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { getAuthorizeURL } from '@/utils/authorization';
import { isInWechat, isLocalhost } from '@/utils/environment';
import { type ExtractModuleState } from '@/store';
import { type StoreCommonAppModule } from '@/store/common/app';
import Option from '@/decorators/option';

const commonAppModule = namespace('common/app');

@Component
export default class LoginPage extends Vue {
  @Option(true) protected static hideTabbar: void;
  @Option(false) protected static bodyAutoHeight: void;

  @commonAppModule.State
  private readonly entryParams!: ExtractModuleState<StoreCommonAppModule, 'entryParams'>;

  protected mounted(): void {
    const useWechatAuth = this.entryParams && !isLocalhost(this.entryParams.hostname) && isInWechat(this.entryParams.userAgent);
    if (useWechatAuth) {
      const to = this.$routeInfo.query.to
        ? this.$router.resolve(this.$routeInfo.query.to)
        : null;
      const redirect = to && getAuthorizeURL('wx', 'login', to.route);
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
