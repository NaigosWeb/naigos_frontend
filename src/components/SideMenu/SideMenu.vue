<script setup lang="ts">
import SideMenuUserCard from "./SideMenuUserCard/SideMenuUserCard.vue";
</script>

<template>
<div class="sidemenu_box">
  <div class="sidemenu_top_placeholder"/>
  <SideMenuUserCard/>
  <hr style="width: 70%; border-top: 1px solid #88d9ff;"/>
  <ul class="sidemenu_list_box">
    <li><a href="#">
      <div>奶果频道信</div>
      <div style="font-size: 13px">NaigosTalk</div>
    </a></li>
    <li><a href="#">
      <div>喵羽邮箱</div>
      <div style="font-size: 13px">YuMail</div>
    </a></li>
    <li><a href="#">
      <div>奶果轻娱乐</div>
      <div style="font-size: 13px">NaigosFunction</div>
    </a></li>
    <li><a href="#">
      <div>共同学习</div>
      <div style="font-size: 13px">StudyTogether</div>
    </a></li>
    <li><a href="#">
      <div>站长博客</div>
      <div style="font-size: 13px">Yasenbaka'sBlog</div>
    </a></li>
    <li><a href="#">
      <div style="font-size: 15px">哈尔滨喵羽科技有限公司</div>
      <div style="font-size: 13px">Miaoyu Technology Co.,Ltd</div>
    </a></li>
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
      border: 1px solid #ffacef
      border-radius: 10px
      height: 40px
      text-align: center
      transition: .5s
    li:hover
      background-color: #ffacef30
    a
      text-decoration: none
      color: #ffacef
</style>