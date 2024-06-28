<script setup lang="ts">

</script>

<template>
<div class="container">
  <div class="list">
    <div class="list_item">星空列车与白的旅行</div>
    <div class="list_item">蔚蓝档案</div>
    <div class="list_item">绫月乃萝</div>
    <div class="list_item">暂未开放</div>
    <div class="list_item">暂未开放</div>
    <div class="list_item">暂未开放</div>
    <div class="list_item">暂未开放</div>
    <div class="list_item">暂未开放</div>
    <div class="list_item">暂未开放</div>
    <div class="list_item">暂未开放</div>
  </div>
  <div>
    <input class="search_bar" placeholder="若分类无法找到，可以搜索关键词，Enter键结束"/>
    <div class="route_view">
      <div class="detail_list">
        <div class="detail_list_item">Saiba Momoi</div>
        <div class="detail_list_item">Saiba Midori</div>
        <div class="detail_list_item">Tentou Alis</div>
        <div class="detail_list_item">Hanago Yuzu</div>
        <div class="detail_list_item">Saiba Momoi</div>
        <div class="detail_list_item">Saiba Midori</div>
        <div class="detail_list_item">Tentou Alis</div>
        <div class="detail_list_item">Hanago Yuzu</div>
        <div class="detail_list_item">Saiba Momoi</div>
        <div class="detail_list_item">Saiba Midori</div>
        <div class="detail_list_item">Tentou Alis</div>
        <div class="detail_list_item">Hanago Yuzu</div>
      </div>
      <div>路由视图区</div>
    </div>
    <div class="download_bar">
      下载信息
    </div>
  </div>
</div>
</template>

<style scoped lang="sass">
@keyframes container_appear
  0%
    opacity: 0
  100%
    opacity: 1
@mixin container_appear_animation
  animation: container_appear 1s 3s ease
  animation-fill-mode: forwards
.container
  @include container_appear_animation()
  opacity: 0
  margin: 50px 3%
  display: grid
  grid-template-columns: 30% 69%
  grid-template-rows: 700px auto
  grid-gap: 1%
  .list
    box-shadow: #f0d4eb 0 0 5px 5px
    border-radius: 10px
    overflow: auto
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: stretch
    flex-wrap: wrap
    gap: 20px
    .list_item
      border-radius: 10px
      height: 20%
      width: 45%
      border: 1px solid #33354c
  .search_bar
    background-color: #ffffff00
    width: 30%
    height: 4%
    margin: 0 0 1% auto
  .download_bar
    margin: 1% auto 0 auto
    height: 20%
    border: 1px solid black
  .route_view
    border: 1px solid black
    height: 500px
    display: grid
    grid-template-columns: 20% 79%
    grid-gap: 1%
    grid-template-rows: 500px
    .detail_list
      overflow-x: auto
      .detail_list_item
        height: 10%
        border: 1px solid black

</style>