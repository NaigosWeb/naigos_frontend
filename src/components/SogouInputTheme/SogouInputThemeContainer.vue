<script setup lang="ts">

</script>

<template>
<div class="container">
  <div class="list">
    <div class="list_item">星空列车与白的旅行</div>
    <div class="list_item">蔚蓝档案</div>
    <div class="list_item">绫月乃萝</div>
    <div class="list_item">绫月乃萝</div>
    <div class="list_item">绫月乃萝</div>
    <div class="list_item">绫月乃萝</div>
    <div class="list_item">绫月乃萝</div>
    <div class="list_item">绫月乃萝</div>
    <div class="list_item">绫月乃萝</div>
    <div class="list_item">绫月乃萝</div>
    <div class="list_item">绫月乃萝</div>
    <div class="list_item">绫月乃萝</div>
  </div>
  <div class="route_view">路由区</div>
</div>
</template>

<style scoped lang="sass">
.container
  //height: 800px
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
  .route_view
    border: 1px solid black
    height: 500px
</style>