<script setup lang="ts">

</script>

<template>
  <div class="main_container_box">
    <div style="height: 110px"></div>
    <div class="functional_box">
      <div class="function_item">全站公告</div>
      <div class="function_item">奶果群聊机器人</div>
      <div class="function_item">档案服务范围</div>
      <div class="function_item">娱乐游戏（开发中）</div>
      <div class="function_item">站长博客</div>
      <div class="function_item">了解夜战家奶果喵羽乐园</div>
      <div class="function_item">服务协议与隐私条款</div>
    </div>
    <div class="banner">
      banner
    </div>
    <div class="works_details_container_box">
      <div class="works_box">作品区</div>
      <div class="details_box">日志区</div>
    </div>
  </div>

</template>

<style scoped lang="sass">
.main_container_box
  margin: 0 auto
  width: 75%
  .functional_box
    display: flex
    justify-content: space-between
  .function_item
    width: 150px
    height: 80px
    border: 1px solid black
    border-radius: 10px
  .banner
    margin: 30px auto
    height: 300px
    border: 1px solid black
    border-radius: 10px
  .works_details_container_box
    display: grid
    grid-template-columns: 65% 30%
    grid-gap: 5%
    height: 300px
    .works_box
      border: 1px solid black
      border-radius: 10px
    .details_box
      border: 1px solid black
      border-radius: 10px
</style>