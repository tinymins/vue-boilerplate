/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { type VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';

import styles from './index.module.scss';

@Component
export default class Progressbar extends Vue {
  private timer = 0;
  private cut = 0;
  private percent = 0;
  private show = false;
  private canSuccess = true;
  private duration = 3000;
  private height = '2px';
  private color = '#5197ff';
  private failedColor = 'red';

  public start(): Progressbar {
    this.show = true;
    this.canSuccess = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.percent = 0;
    }
    this.cut = 10000 / Math.floor(this.duration);
    this.timer = window.setInterval(() => {
      this.increase(this.cut * Math.random());
      if (this.percent > 95) {
        this.finish();
      }
    }, 100);
    return this;
  }

  public set(num: number): Progressbar {
    this.show = true;
    this.canSuccess = true;
    this.percent = Math.floor(num);
    return this;
  }

  public get(): number {
    return Math.floor(this.percent);
  }

  public increase(num: number): Progressbar {
    this.percent += Math.floor(num);
    return this;
  }

  public decrease(num: number): Progressbar {
    this.percent -= Math.floor(num);
    return this;
  }

  public finish(): Progressbar {
    this.percent = 100;
    this.hide();
    return this;
  }

  public abort(): Progressbar {
    this.percent = 0;
    this.hide();
    return this;
  }

  public pause(): Progressbar {
    clearInterval(this.timer);
    return this;
  }

  public hide(): Progressbar {
    clearInterval(this.timer);
    this.timer = 0;
    window.setTimeout(() => {
      this.show = false;
      this.$nextTick(() => {
        window.setTimeout(() => {
          this.percent = 0;
        }, 200);
      });
    }, 500);
    return this;
  }

  public fail(): Progressbar {
    this.canSuccess = false;
    return this;
  }

  public render(): VNode {
    return <div
      class={styles.progress}
      style={{
        width: `${this.percent}%`,
        height: this.height,
        opacity: this.show ? 1 : 0,
        'background-color': this.canSuccess ? this.color : this.failedColor,
      }}
    ></div>;
  }
}
