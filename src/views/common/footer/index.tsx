/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { VNode } from 'vue';
import { Vue, Component } from 'vue-property-decorator';
import styles from './index.module.scss';

@Component
export default class FooterView extends Vue {
  public render(): VNode {
    return <div class={styles.footer}>
      <div class={styles.copyright}>Powered By &copy;一名宅</div>
    </div>;
  }
}
