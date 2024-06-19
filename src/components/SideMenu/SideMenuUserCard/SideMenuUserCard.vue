<script setup lang="ts">

</script>

<template>
<div class="sidemenu_usercard_box">
  <div id="sidemenu_usercard_avatar_box">
    <img id="sidemenu_usercard_avatar" src="@/assets/avatar.png" alt="avatar"/>
  </div>
  <div style="">
    <span>用户名字</span>
    <span style="top: 45%; font-size: 16px">Lv.99</span>
  </div>
</div>
</template>

<style scoped lang="sass">
.sidemenu_usercard_box
  position: relative
  margin: 0 auto 15% auto
  width: 85%
  height: 80px
  box-shadow: #ffacef 0 0 10px
  border-radius: 14px
  span
    position: absolute
    left: 35%
    top: 15%
    font-size: 20px
  #sidemenu_usercard_avatar_box
    position: absolute
    left: 5%
    top: 50%
    transform: translate(0, -50%)
    width: 60px
    height: 60px
    border: 1px solid #88d9ff
    border-radius: 12px
    display: flex
    align-items: center
    justify-content: center
  #sidemenu_usercard_avatar
    width: 54px
    border: 1px solid #ffacef
    border-radius: 10px
</style>