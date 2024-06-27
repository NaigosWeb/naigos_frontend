<script setup lang="ts">
import {HomeFilled} from '@element-plus/icons-vue';
</script>

<template>
  <div class="view_bg"/>
  <header class="sg_header">
    <div class="user_bar">
      <div class="user_avatar_box"><img src="@/assets/avatar.jpg" alt="avatar"/></div>
    </div>
  </header>
  <RouterLink to="/"><div class="view_bg_icon">
    <el-icon class="view_bg_icon_el" size="40" color="#2A2F58FF" style="top: 40%; left: 70%; transform: rotateZ(-45deg)"><HomeFilled /></el-icon>
  </div></RouterLink>
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
@keyframes bg_icon_appear
  0%
    opacity: 0
    width: 2000px
    height: 2000px
    background-color: #ffffff
  100%
    opacity: 1
    width: 210px
    height: 210px
    background-color: #f1f0f3
@mixin bg_icon_appear_animation
  animation: bg_icon_appear 2s ease
  animation-fill-mode: forwards
@keyframes sg_header_appear
  0%
    left: -500px
  100%
    left: 0
@mixin sg_header_appear_animation
  animation: sg_header_appear 2s 1.6s ease
  animation-fill-mode: forwards
@keyframes view_bg_icon_el_appear
  0%
    opacity: 0
  100%
    opacity: 1
@mixin view_bg_icon_el_appear_animation
  animation: view_bg_icon_el_appear 1s 3s ease
  animation-fill-mode: forwards
.view_bg_icon:hover
  box-shadow: rgb(229, 201, 225) 0 0 10px 5px
  background-color: #f1f0f3
.view_bg_icon
  position: fixed
  top: 0
  left: 0
  transform: translate(-50%, -50%) rotateZ(45deg)
  opacity: 0
  width: 2000px
  height: 2000px
  background-color: #fff
  box-shadow: #33354c50 0 0 10px 5px
  transition: .8s
  @include bg_icon_appear_animation()
  .view_bg_icon_el:hover
    color: #f0d4eb
  .view_bg_icon_el
    opacity: 0
    transition: .5s
    @include view_bg_icon_el_appear_animation()
.sg_header
  position: relative
  left: -500px
  @include sg_header_appear_animation()
  background-color: #fff
  height: 80px
  width: 500px
  box-shadow: #33354c50 0 0 10px 5px
  .user_bar
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-190%, -50%)
    .user_avatar_box
      position: relative
      border: 1px solid #33354c
      width: 56px
      height: 56px
      border-radius: 8px
      img
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        border: 1px solid #33354c
        width: 50px
        height: 50px
        border-radius: 5px
</style>