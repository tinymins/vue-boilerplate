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
import { USER } from '@/store/types';
import { StoreUserGetters } from '@/store/user';
import XButton from '@/components/x-button';
import styles from '@/styles/views/user/me.module.scss';

const userModule = namespace('user');

@Component
export default class UserMePage extends Vue {
  @Option(true) protected static hideTabbar;

  @userModule.Getter private readonly user!: StoreUserGetters['user'];
  @userModule.Action(USER.LOGOUT) private actionLogout;

  private logout(): void {
    this.actionLogout();
  }

  public render(): VNode {
    return <div class={styles.user}>
      <div>me</div>
      {
        this.user
          ? <p>
            当前用户：{ this.user.name }
          </p>
          : null
      }
      <XButton on={{ click: this.logout }}>Logout</XButton>
    </div>;
  }
}
