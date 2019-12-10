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
import { StoreUserState } from '@/store/user';
import XButton from '@/components/x-button';
import styles from '@/styles/views/403.module.scss';

const userModule = namespace('user');

@Component
export default class ForbiddenPage extends Vue {
  @Option(true) protected static hideTabbar;

  @userModule.State private readonly errmsg!: StoreUserState['errmsg'];

  private get text(): string {
    return this.errmsg || '无权限';
  }

  public render(): VNode {
    return <div>
      <div class={styles['a-403__text']}>
        <p>{ this.text }</p>
      </div>
      <div class={styles['a-403__btns']}>
        <XButton class={styles['a-403__btn']} invert outline to={{ name: 'index' }}>返回首页</XButton>
      </div>
    </div>;
  }
}
