<script setup lang="ts">

</script>

<template>
  <img class="bg" src="../../../assets/BlueArchive/bg_big_triangle.png" alt="bg"/>
  <div class="title_logo_box">
    <img class="title_logo" src="../../../assets/BlueArchive/record_title.png" alt="title_logo"/>
    <img class="title_bar" src="../../../assets/BlueArchive/title_bar.png" alt="bar" />
    <span class="title_text">这里收录了互联网上各种BA相关内容</span>
  </div>
</template>

<style scoped lang="sass">
@keyframes title_box_in
  0%
    opacity: 0
    left: 10%
  100%
    opacity: 1
    left: 15%
@mixin title_box_in_ani()
  animation: title_box_in .8s 1s ease forwards
@keyframes bg_in
  0%
    opacity: 0
    left: 40%
  100%
    opacity: 1
    left: 50%
@mixin bg_in_ani()
  animation: bg_in .5s .8s ease forwards
.bg
  @include bg_in_ani()
  opacity: 0
  position: absolute
  width: 95%
  top: 50%
  transform: translate(-50%, -50%)
.title_logo_box
  @include title_box_in_ani()
  opacity: 0
  width: 400px
  position: absolute
  top: 15%
  .title_bar
    position: absolute
    bottom: 5%
    left: 45%
  .title_text
    letter-spacing: 1px
    font-size: 18px
    color: #666
    width: 100%
    position: absolute
    bottom: 20%
    left: 75%
  .title_en
    position: absolute
//opacity: 0
</style>