<template>
  <transition name="fade" mode="out-in">
    <div class="main">
      <router-view name="header"></router-view>
      <router-view name="main"></router-view>
      <router-view name="footer"></router-view>
    </div>
  </transition>
</template>
<script>
export default {

};
</script>

<style>

</style>
