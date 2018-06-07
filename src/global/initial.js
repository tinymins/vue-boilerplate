/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-22 15:45:35
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-07 09:57:54
 */
import 'normalize.css';
import Vue from 'vue';
import { isDevelop } from '@/utils/environment';

Vue.config.productionTip = false;

if (isDevelop()) {
  const el = document.createElement('div');
  import('eruda').then((eruda) => {
    eruda.init({
      container: el,
      tool: [
        'console',
        'elements',
        'network',
        'resource',
        'info',
        'snippets',
        'sources',
        'feature',
      ],
    });
  });
  document.body.appendChild(el);
}
