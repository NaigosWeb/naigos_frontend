<script setup lang="ts">
import {onMounted, ref} from "vue";
import {http} from "@/utils/http";

const themeAllItems = ref([]);
const isDetailsBox = ref(false);
const themeItem = ref()

function closeDetailsBox(){
  isDetailsBox.value = false;
}

function themeItemClicked(themeId: string){
  isDetailsBox.value = true;
  console.log(themeId);
  http({
    url: `api/sogou_input_theme/get_only_item?theme_id=${themeId}`,
    method: 'GET'
  }).then(res => {
    if (res.data.code === 0){
      themeItem.value = res.data.data;
    } else {
      alert('皮肤详情获取失败');
    }
  }).catch(err => {
    console.error(err);
  })
}

onMounted(() => {
  http({
    url: 'api/sogou_input_theme/get_all_item',
    method: 'GET'
  }).then(res => {
    if (res.data.code === 0){
      themeAllItems.value = res.data.data;
    } else {
      alert('奶果服务-搜狗输入法皮肤模块貌似出错！');
    }
  }).catch(err => {
    console.error(err);
  })
})
</script>

<template>
<div class="container">
  <div
      @click="themeItemClicked(theme['theme_id'])"
      class="theme_item"
      v-for="theme in themeAllItems"
      :key="theme['theme_id']">
    <span class="theme_name">{{theme['name']}}</span>
    <img class="header_image" :src="theme['header_image']" alt="img"/>
  </div>
  <div v-if="isDetailsBox" class="details_box">
    <img class="dt_header_images" :src="themeItem['header_image']" alt="img"/>
    <button id="close" @click="closeDetailsBox">关闭</button>
    <div>{{themeItem['name']}}</div>
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
  .theme_item
    width: 250px
    height: 150px
    overflow: hidden
    position: relative
    .header_image
      position: absolute
      top: 0
      left: 0
      width: 100%
      z-index: -1
    .theme_name
      color: #fff
      font-weight: bold
      text-shadow: #333451 0 0 5px
  .details_box
    position: fixed
    right: 0
    top: 0
    width: 600px
    height: 100vh
    background-color: #f0d4eb
    #close
      position: absolute
      top: 0
      left: 0
    .dt_header_images
      width: 100%
      height: 200px
  //display: grid
  //grid-template-columns: 30% 69%
  //grid-template-rows: 700px auto
  //grid-gap: 1%
</style>