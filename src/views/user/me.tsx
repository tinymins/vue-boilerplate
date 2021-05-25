/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import Option from '@/decorators/option';
import * as USER from '@/store/user/types';
import { StoreUserGetters, StoreUserModule, StoreUserState } from '@/store/user';
import XButton from '@/components/x-button';
import styles from '@/styles/views/user/me.module.scss';
import { StoreRootState } from '@/store';
import { Module } from 'vuex';

const userModule = namespace('user');

type Action<T extends Module<S, StoreRootState>, K extends keyof T['actions'], S> = T['actions'][K];

@Component
export default class UserMePage extends Vue {
  @Option(true) protected static hideTabbar: never;

  @userModule.Getter private readonly user!: StoreUserGetters['user'];
  @userModule.Action(USER.LOGOUT) private actionLogout: Action<StoreUserModule, typeof USER.LOGOUT, StoreUserState>;

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
