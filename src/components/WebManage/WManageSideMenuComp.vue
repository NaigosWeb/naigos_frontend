<script setup lang="ts">
import {StarFilled} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
const router = useRouter();

interface ItemImpl {
  title: string,
  routerName: string,
  icon?: any;
}

const itemList: ItemImpl[] = [
  {title: '用户管理', routerName: 'WebManageUser'},
  {title: '公告管理', routerName: 'WebManageNotice'}
];

const itemClicked = (routerName: string) => {
  router.replace({name: routerName});
}
</script>

<template>
  <div class="side_menu_box">
    <div class="item_1" v-for="(item, index) in itemList" :key="index" @click="itemClicked(item.routerName)">
      <span class="item_title">
        <el-icon class="is-loading icon"><StarFilled /></el-icon>
        {{item.title}}
      </span>
    </div>
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
    cursor: pointer
    .item_title
      padding: 0
      margin: 0 auto
      display: flex
      align-items: center
      .icon
        margin-right: 10px

</style>