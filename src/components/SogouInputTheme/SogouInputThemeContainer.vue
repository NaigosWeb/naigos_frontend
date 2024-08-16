<script setup lang="ts">
import {onMounted, ref} from "vue";
import {http} from "@/utils/http";
import {CloseBold} from "@element-plus/icons-vue";

const themeAllItems = ref([]);
const isDetailsBox = ref(false);
const themeItem = ref()
const isDownloadHref = ref(false);

function closeDetailsBox(){
  isDetailsBox.value = false;
}

function themeItemClicked(themeId: string){
  isDownloadHref.value = true;
  isDetailsBox.value = true;
  console.log(themeId);
  http({
    url: `api/sogou_input_theme/get_only_item?theme_id=${themeId}`,
    method: 'GET'
  }).then(res => {
    if (res.data.code === 0){
      themeItem.value = res.data.data;
      isDownloadHref.value = false;
    } else {
      alert('皮肤详情获取失败');
    }
  }).catch(err => {
    console.error(err);
  })
}

function downloadClicked(url: string){
  window.location.replace(url);
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
    <div class="dt_header_images_box">
      <img class="dt_header_images" :src="themeItem['header_image']" alt="img"/>
    </div>
    <button id="close" @click="closeDetailsBox"><el-icon><CloseBold /></el-icon></button>
    <div class="theme_name">{{themeItem['name']}}</div>
    <div class="theme_introduce">{{themeItem['introduce']}}</div>
    <button :disabled="isDownloadHref" class="theme_download" @click="downloadClicked(themeItem['url'])">点击下载</button>
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
    background-color: #f0d4eb50
    box-shadow: #fff 0 0 5px
    #close
      position: absolute
      top: 0
      left: 0
    .dt_header_images_box
      width: 100%
      height: 200px
      overflow: hidden
      position: relative
      .dt_header_images
        position: absolute
        top: -50%
        width: 100%
    .theme_name
      margin-top: 20px
      text-align: center
      font-size: 20px
      font-weight: bold
      color: white
      letter-spacing: 1px
    .theme_introduce
      margin-top: 15px
      text-align: center
      color: #fcb9e3
      text-shadow: white 0 0 2px
      letter-spacing: 1px
    .theme_download:hover
      cursor: pointer
      background-color: #fdcaf7
      box-shadow: #57505d 0 0 5px
      color: #57505d
    .theme_download:disabled
      background-color: #a295ad
      box-shadow: #57505d 0 0 5px
      color: #57505d
    .theme_download
      position: absolute
      margin-top: 20px
      left: 50%
      transform: translateX(-50%)
      letter-spacing: 2px
      font-size: 17px
      font-weight: bold
      border-radius: 5px
      color: white
      background-color: #57505d
      border: none
      box-shadow: #fdcaf7 0 0 5px
      width: 130px
      height: 40px
      transition: .3s ease

  //display: grid
  //grid-template-columns: 30% 69%
  //grid-template-rows: 700px auto
  //grid-gap: 1%
</style>