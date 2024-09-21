<script setup lang="ts">
import {onBeforeUnmount, onMounted} from "vue";
import {tfsChange, bgvChange} from "@/utils/BlueArchive/BaTfsBgvUtil";

onMounted(() => {
  bgvChange(false);
})
onBeforeUnmount(() => {
  tfsChange();
})
</script>

<template>
  <div class="bg_box">
    <img class="bg_big_triangle" src="@/assets/BlueArchive/bg_big_triangle.png" alt="bg_big_triangle"/>
  </div>
  <div class="title">
    <img class="title_bar" src="@/assets/BlueArchive/title_bar.png" alt="title_bar"/>
    <img class="title_img" src="@/assets/BlueArchive/record_title.png" alt="title"/>
    <span class="sub_title">这里收录了互联网上优秀的二次创作作品</span>
  </div>
</template>

<style scoped lang="sass">
@keyframes bg_in
  0%
    opacity: 0
    left: 45%
  100%
    opacity: 1
    left: 50%
@mixin bg_in_ani()
  animation: bg_in .8s 1.2s ease
  animation-fill-mode: forwards
.bg_box
  @include bg_in_ani()
  width: 80%
  position: fixed
  left: 45%
  opacity: 0
  top: 50%
  transform: translate(-50%, -50%)
  .bg_big_triangle
    width: 100%
@keyframes title_in
  0%
    opacity: 0
    margin: 0 auto 0 5%
  100%
    opacity: 1
    margin: 0 auto 0 10%
@mixin title_in_ani()
  animation: title_in .8s 1.5s ease
  animation-fill-mode: forwards
.title
  @include title_in_ani()
  opacity: 0
  margin: 0 auto 0 5%
  position: relative
  width: 35%
  .title_bar
    position: absolute
    bottom: 10%
    left: 20%
  .sub_title
    position: absolute
    color: #666
    font-size: 18px
    letter-spacing: 2px
    bottom: 20%
</style>