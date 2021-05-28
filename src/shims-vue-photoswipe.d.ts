/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

declare module 'vue-photoswipe.js' {
  import { PluginObject } from 'vue';
  import VueWechat from 'vue-wechat/1.4.0';

  const VuePhotoswipe: PluginObject<{
    pswpOptions: {
      showShare: boolean;
      showZoom: boolean;
      showArrow: boolean;
      showFullscreen: boolean;
    };
    wechat: typeof VueWechat;
  }>;
  export default VuePhotoswipe;
}
