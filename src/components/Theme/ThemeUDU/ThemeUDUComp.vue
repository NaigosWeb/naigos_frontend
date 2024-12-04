<script setup lang="ts">
import {useRouter} from "vue-router";
const router = useRouter();

const sideItemList: Array<{title: string, router_name: string}> = [
  {title: '上传', router_name: 'ThemeUDUUpload'},
  {title: '删除', router_name: 'ThemeUDUDelete'},
  {title: '修改', router_name: 'ThemeUDUUpdate'}
]
const sideItemClicked = (routerName: string) => {
  router.replace({name: routerName});
}
</script>

<template>
  <h2>上传、删除、修改您的作品</h2>
  <div class="theme_udu_container">
    <div class="side_menu_box">
      <ul>
        <li v-for="(item, index) in sideItemList"
              :key="index"
              @click="sideItemClicked(item.router_name)">
          {{item.title}}
        </li>
      </ul>
    </div>
    <RouterView/>
  </div>
</template>

<style scoped lang="sass">
h2
  text-align: center
.theme_udu_container
  display: flex
  gap: 20px
  padding: 0 20%
  .side_menu_box
    width: 20%
    ul
      padding: 0
      margin: 0
      li
        margin-bottom: 20px
        border: 1px solid #f0d4eb
        background-color: #f0d4eb50
        border-radius: 10px
        height: 50px
        list-style: none
</style>