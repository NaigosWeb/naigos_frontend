<script setup lang="ts">

import SideMenuUserCard from "@/components/SideMenu/SideMenuUserCard/SideMenuUserCard.vue";
</script>

<template>
<div class="sidemenu_box">
  <div class="sidemenu_top_placeholder"/>
  <SideMenuUserCard/>
  <hr style="width: 70%; border-top: 1px solid #88d9ff;"/>
  <ul class="sidemenu_list_box">
    <li><a href="#">通信联络</a></li>
    <li><a href="#">喵羽邮箱</a></li>
    <li><a href="#">奶果功能</a></li>
    <li><a href="#">奶果功能</a></li>
    <li><a href="#">奶果功能</a></li>
  </ul>
</div>
</template>

<style scoped lang="sass">
.sidemenu_box
  height: 100vh
  .sidemenu_top_placeholder
    height: 5%
  .sidemenu_list_box
    margin: 10% auto 0 auto
    padding: 0
    width: 80%
    li
      list-style: none
      margin-bottom: 10%
    a
      border: 1px solid #ffacef
      border-radius: 10px
      text-align: center
      height: 40px
      text-decoration: none
      color: #ffacef
</style>