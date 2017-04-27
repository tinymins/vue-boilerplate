<template>
  <div class="wrap">
    <transition name="fade" mode="out-in">
      <div class="main">
        <router-view name="tabbar"></router-view>
        <router-view name="main"></router-view>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  // name: 'app',
};
</script>

<style>
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>
