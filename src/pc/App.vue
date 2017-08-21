<template>
  <transition name="fade" mode="out-in">
    <div class="body-wrapper">
      <router-view name="header"></router-view>
      <router-view name="main" class="main"></router-view>
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
