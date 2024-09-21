<script setup lang="ts">

</script>

<template>
  <div class="title">
    <img class="title_bar" src="@/assets/BlueArchive/title_bar.png" alt="title_bar"/>
    <img class="title_img" src="@/assets/BlueArchive/re-creation_title.png" alt="title"/>
    <span class="sub_title">在这里寻找站长的二创作品</span>
    <img class="title_en" src="@/assets/BlueArchive/re-creation_en_title.png" alt="title_en"/>
  </div>
</template>

<style scoped lang="sass">
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
  width: 80%
  .title_bar
    position: absolute
    bottom: 10%
    left: 12%
  .sub_title
    position: absolute
    color: #666
    font-size: 18px
    letter-spacing: 2px
    bottom: 20%
  .title_en
    position: absolute
    right: 0
    bottom: -150%
</style>