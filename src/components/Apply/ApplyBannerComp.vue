<script setup lang="ts">

</script>

<template>
  <div class="banner_box">
    <img class="banner" src="@/assets/Apply/banner.jpg" alt="banner"/>
  </div>
</template>

<style scoped lang="sass">
@keyframes banner_box_in
  0%
    transform: translateY(-20px)
  100%
    transform: translateY(0)
@mixin banner_box_in_ani()
  animation: banner_box_in .8s ease forwards
.banner_box:hover
  opacity: 1
.banner_box
  @include banner_box_in_ani()
  transition: .3s ease
  opacity: .8
  width: 70%
  height: 250px
  margin: 50px auto 0 auto
  position: relative
  border-radius: 20px
  overflow: hidden
  .banner
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
</style>