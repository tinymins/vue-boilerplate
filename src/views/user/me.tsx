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

import { type ExtractModuleAction, type ExtractModuleGetter } from '@/store';
import { type StoreUserModule, USER } from '@/store/user';
import XButton from '@/components/x-button';
import Option from '@/decorators/option';

import styles from './me.module.scss';

const userModule = namespace('user');

@Component
export default class UserMePage extends Vue {
  @Option(true) protected static hideTabbar: never;

  @userModule.Getter
  private readonly user!: ExtractModuleGetter<StoreUserModule, 'user'>;

  @userModule.Action(USER.LOGOUT)
  private readonly actionLogout!: ExtractModuleAction<StoreUserModule, USER.LOGOUT>;

  private logout(): void {
    this.actionLogout();
  }

  public render(): VNode {
    return <div class={styles.main}>
      {
        this.user
          ? <p>
            当前用户：{ this.user.name }
          </p>
          : null
      }
      <router-link to={{ name: 'user_login_dev' }}>Login Dev</router-link>
      <div class={styles.buttons}>
        <XButton class={styles.button} danger on={{ click: this.logout }}>Logout</XButton>
      </div>
    </div>;
  }
}
