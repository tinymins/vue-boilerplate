<template>
    <footer>
    <mt-tabbar v-model="selected">
      <mt-tab-item id="home">
        <img slot="icon" src="@assets/100x100.png">
        home
      </mt-tab-item>
      <mt-tab-item id="msg">
        <img slot="icon" src="@assets/100x100.png">
        msg
      </mt-tab-item>
      <mt-tab-item id="secret">
        <img slot="icon" src="@assets/100x100.png">
        secret
      </mt-tab-item>
      <mt-tab-item id="me">
        <img slot="icon" src="@assets/100x100.png">
        me
      </mt-tab-item>
    </mt-tabbar>
  </footer>
</template>

<script>
  export default {
    computed: {
      selected: {
        set(name) {
          this.$router.push({ name });
        },
        get() {
          let active = this.$route.name;
          Object.values(this.$route.matched).forEach((obj) => {
            if (obj.meta.parent) {
              active = obj.meta.parent;
            }
          });
          return active;
        },
      },
    },
  };
</script>
