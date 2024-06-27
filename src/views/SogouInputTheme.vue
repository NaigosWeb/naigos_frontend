<script setup lang="ts">
import SogouInputThemeHeader from "@/components/SogouInputTheme/SogouInputThemeHeader.vue";
import SogouInputThemeContainer from "@/components/SogouInputTheme/SogouInputThemeContainer.vue";
</script>

<template>
  <div class="view_bg"/>
  <SogouInputThemeHeader/>
  <SogouInputThemeContainer/>
</template>

<style scoped lang="sass">
@keyframes bg_appear
  0%
    opacity: 0
  100%
    opacity: 100
@mixin bg_appear_animation
  animation: bg_appear .8s .5s
  animation-fill-mode: forwards
.view_bg
  position: fixed
  top: 0
  left: 0
  z-index: -1
  background-image: url("@/assets/SogouInputThemeView/bg.png")
  background-size: cover
  height: 100vh
  width: 100vw
  opacity: 0
  @include bg_appear_animation()
</style>