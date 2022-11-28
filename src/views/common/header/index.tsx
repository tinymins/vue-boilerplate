/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { Menu, MenuItem, Submenu } from 'element-ui';
import { type VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';

import { getTabbarData, TabbarItemData, TabbarSubItemData } from '@/router/tabbars';

import styles from './index.module.scss';

Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);

@Component
export default class HeaderView extends Vue {
  private get tabbarData(): TabbarItemData[] {
    return getTabbarData(this.$route);
  }

  private get selected(): string {
    let name = this.$route.name || '';
    Object.values(this.$route.matched).forEach((r) => {
      if (r.meta.tabbar) {
        name = r.meta.tabbar.replace(/[^/]+\//u, '');
      }
    });
    return name;
  }

  private set selected(selected: string) {
    this.$router.push({ name: selected });
  }

  private get tabbarSel(): TabbarSubItemData[] {
    return this.tabbarData.map((sub) => {
      if (sub.route && sub.route.name === this.$routeInfo.name) {
        return sub;
      }
      if (sub.children) {
        const child = sub.children.find(tab => tab.route && tab.route.name === this.$route.name);
        if (child) {
          return child;
        }
        return sub.children[0];
      }
      return sub;
    });
  }

  public render(): VNode {
    return <header>
      <div class={styles['nav-wrapper']}>
        <div class={styles.nav}>
          <el-menu default-active={this.selected} class={styles['nav-menu']} mode="horizontal" router>
            {
              this.tabbarData.map((sub, i) => {
                if (sub.children && sub.children.length > 1) {
                  return <el-submenu index={`${i}`}>
                    <span slot="title">{ this.tabbarSel[i].text }</span>
                    {
                      sub.children.map(tab => <el-menu-item index={tab.name} route={tab.route}>{ tab.text }</el-menu-item>)
                    }
                  </el-submenu>;
                }
                return <el-menu-item index={sub.name} route={sub.route}>{ sub.text }</el-menu-item>;
              })
            }
          </el-menu>
        </div>
      </div>
    </header>;
  }
}
