<template>
  <div>
    <div>index</div>
    <br><button @click="showToast">弹三个Toast</button>
    <br><button @click="showDialog">弹两个Dialog</button>
    <br><button @click="showLoading">弹五秒Loading</button>
    <br><button @click="showActionsheet">弹三个Actionsheet</button>
    <br><br><router-link :to="{ name: 'popup' }">popup</router-link>
  </div>
</template>

<script>
export default {
  methods: {
    showToast() {
      this.$showToast({ text: '01234' });
      this.$showToast({ text: '56789' });
      const id = this.$showToast({ text: '66789' });
      this.$showToast({ text: 'ABCDE' });
      this.$hideToast({ id });
    },
    showDialog() {
      this.$showDialog({
        type: 'confirm',
        title: '确定？',
        content: '？',
        buttons: [
          { label: '嗯。', primary: true, action: () => {} },
        ],
      });
      this.$showDialog({ type: 'alert', content: '懂？' });
    },
    showLoading() {
      const id = this.$showLoading({ text: '5秒' });
      setTimeout(() => this.$hideLoading({ id }), 5000);
    },
    showActionsheet() {
      this.$showActionsheet({
        title: '第一个',
        data: [
          { id: 'op1', content: '撤销错误的' },
          { id: 'op2', content: '不撤销了吧' },
        ],
        handler: ({ id }) => {
          if (id === 'op1') {
            this.$hideActionsheet({ id: 'actionsheet1' });
          }
          this.$showActionsheet({
            title: '第三个',
            data: [{ id: 'op1', content: '选项一' }],
            handler: () => {},
          });
        },
      });
      this.$showActionsheet({
        id: 'actionsheet1',
        title: '不应该有这个',
        data: [{ id: 'op1', content: '选项一' }],
        handler: () => {},
      });
      this.$showActionsheet({
        title: '第二个',
        data: [{ id: 'op1', content: '选项一' }],
        handler: () => {},
      });
    },
  },
};
</script>
