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
import { USER } from '@/store/types';
import styles from '@/styles/views/user/login_dev.module.scss';

const userModule = namespace('user');

@Component
export default class LoginDevPage extends Vue {
  @userModule.Action(USER.LOGIN) private login;

  private debugLogin(phone): void {
    const data = {
      phone,
      code: 'code',
    };
    this.login(data);
  }

  public render(): VNode {
    return <div>
      <p>测试登录</p>
      {
        [1, 2, 3, 4].map(i => <p>
          <button onClick={() => this.debugLogin(`debug${i}`)}>设置用户debug{ i }</button>
        </p>)
      }
      <a href="https://dev.haimanchajian.com/debug.php/site/debug-mock?id=4">Safari点此先设置cookie</a>
      <p class={styles.rem75}>750px</p>
      <p class={styles.rem64}>640px</p>
    </div>;
  }
}
