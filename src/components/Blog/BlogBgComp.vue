<script setup lang="ts">

</script>

<template>
  <div class="bg_box">
    <img class="bg" src="@/assets/Blog/black_start_bg.png" alt="bg" />
    <img class="zhezhao" src="@/assets/Main/zhezhao.png" alt="zhezhao" />
  </div>
</template>

<style scoped lang="sass">
.bg_box
  position: fixed
  width: 100%
  height: 100%
  z-index: -5
  .bg
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    z-index: -2
    min-width: 100%
  .zhezhao
    position: absolute
    min-width: 100%
    min-height: 100%
    z-index: -1
</style>