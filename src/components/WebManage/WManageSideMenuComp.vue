<script setup lang="ts">
interface ItemImpl {
  title: string,
  routerName: string,
  icon?: any
}

const itemList: ItemImpl[] = [
  {title: '用户管理', routerName: ''},
  {title: '公告管理', routerName: ''}
];
</script>

<template>
  <div class="side_menu_box">
    <div class="item_1" v-for="(item, index) in itemList" :key="index">{{item.title}}</div>
  </div>
</template>

<style scoped lang="sass">
.side_menu_box
  width: 300px
  min-height: calc(100vh - 60px)
  background-color: #3d3643
  .item_1:hover
    background-color: #372f3c
  .item_1
    background-color: #3d3643
    display: flex
    align-items: center
    height: 60px
    width: 100%
    color: white
    font-size: 18px
</style>