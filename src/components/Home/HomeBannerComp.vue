<script setup lang="ts">

</script>

<template>
  <div class="banner_box">
    <img src="@/assets/Main/banner.jpg" alt="banner" />
  </div>
</template>

<style scoped lang="sass">
@keyframes banner_box_in
  0%
    transform: translateY(20px)
  100%
    transform: translateY(0)
@mixin banner_box_in_ani()
  animation: banner_box_in
  animation-duration: .8s
  animation-fill-mode: forwards
.banner_box:hover
  opacity: 1
.banner_box
  opacity: .8
  width: 100%
  max-height: 300px
  border-radius: 20px
  margin-bottom: 30px
  overflow: hidden
  transition: opacity .8s ease
  @include banner_box_in_ani()
  img
    width: 100%
</style>