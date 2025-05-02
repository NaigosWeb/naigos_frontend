<script setup lang="ts">
import BG from "@/assets/BlueArchiveNew/bg.jpg"
</script>

<template>
  <div class="bg_box">
    <img class="bgi" :src="BG" alt="BG"/>
  </div>
</template>

<style scoped lang="css">
.bg_box {
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: -5;
  .bgi {
    min-height: 100%
  }
}
</style>