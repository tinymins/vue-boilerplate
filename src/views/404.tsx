import Vue, { VNode } from 'vue';
import styles from '@/styles/views/404.module.scss';

// 原理是先过一遍 ts-loader 然后在过 babel-loader
// 比较坑就是了
// .tsx 后缀直接走 babel-loader

export default Vue.extend({
  mounted(): void {
    console.log('hello 404'); // eslint-disable-line
  },
  methods: {
    test(): void {
      const name: string = 'hello';
      console.log(name); // eslint-disable-line
    },
  },
  render(): VNode {
    const b = [1, 2, 3];
    return (
      <div onClick={this.test} class={styles.a404}>
        { b.map((): VNode => <br />) }
        <center>页面不存在</center>
        <br />
        <br />
        <center><router-link tag="button" to={{ name: 'index' }}>返回主页</router-link></center>
        <center style="color: #ddd">This project started building with typescript</center>
      </div>
    );
  },
});
