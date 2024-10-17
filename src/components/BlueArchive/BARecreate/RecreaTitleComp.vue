<script setup lang="ts">

</script>

<template>
  <div class="title_logo_box">
    <img class="title_logo" src="../../../assets/BlueArchive/re-creation_title.png" alt="title_logo" />
    <img class="title_bar" src="../../../assets/BlueArchive/title_bar.png" alt="bar" />
    <span class="title_text">这里收录了站长Yasenbaka的全部BA二创</span>
    <img class="title_en" src="../../../assets/BlueArchive/re-creation_en_title.png" alt="en_title_logo" />
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
@keyframes title_en_in
  0%
    opacity: 0
    right: -240%
  100%
    opacity: 1
    right: -250%
@mixin title_en_in_ani()
  animation: title_en_in .5s 1.2s ease forwards
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
    font-size: 19px
    color: #666
    width: 100%
    position: absolute
    bottom: 20%
    left: 75%
    font-family: BAFJ_CU, sans-serif
  .title_en
    @include title_en_in_ani()
    position: absolute
    opacity: 0
</style>