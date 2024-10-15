<script setup lang="ts">

import bg from "@/assets/Sign/bg_1080.jpg";
import zhezhao from "@/assets/Main/zhezhao.png";
</script>

<template>
  <div class="bg_box">
    <img class="bg" :src="bg" alt="bg"/>
    <img class="zhezhao" :src="zhezhao" alt="zhezhao"/>
  </div>
</template>

<style scoped lang="sass">
.bg_box
  width: 100%
  height: 100vh
  position: relative
  overflow: hidden
  z-index: -5
  .bg
    position: absolute
    min-width: 100%
    z-index: -2
  .zhezhao
    position: absolute
    height: 100vh
    width: 100%
</style>