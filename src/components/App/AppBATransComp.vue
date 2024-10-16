<script setup lang="ts">

</script>

<template>
  <div class="trans_box">
    <video class="transv" src="@/assets/BlueArchive/transfrom.webm" autoplay muted/>
  </div>
</template>

<style scoped lang="sass">
.trans_box
  position: fixed
  width: 100%
  height: 100vh
  overflow: hidden
  z-index: 99
  .transv
    min-height: 100vh
</style>