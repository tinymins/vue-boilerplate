/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { VNode } from 'vue';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class MainView extends Vue {
  public render(): VNode {
    return <router-view></router-view>;
  }
}
