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
import { ExtractModuleAction } from '@/store';
import { StoreUserModule, USER } from '@/store/user';
import styles from '@/styles/views/user/login-dev.module.scss';

const userModule = namespace('user');

@Component
export default class LoginDevPage extends Vue {
  @userModule.Action(USER.LOGIN)
  private readonly login: ExtractModuleAction<StoreUserModule, USER.LOGIN>;

  private debugLogin(phone: string) {
    const data = {
      phone,
      code: 'code',
    };
    this.login(data);
  }

  public render(): VNode {
    return <div class={styles.main}>
      <div class={styles.title}>测试登录</div>
      <div class={styles.content}>
        <ul class={styles.buttons}>
          {
            [1, 2, 3, 4].map(i => <li>
              <button onClick={() => this.debugLogin(`debug${i}`)}>设置用户debug{ i }</button>
            </li>)
          }
        </ul>
      </div>
      <div class={styles.title}>px2rem</div>
      <div>
        <p class={styles.rem75}>750px</p>
        <p class={styles.rem64}>640px</p>
      </div>
    </div>;
  }
}
