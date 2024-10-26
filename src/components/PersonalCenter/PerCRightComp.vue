<script setup lang="ts">
import {ref} from "vue";
import NaigosItem from "@/assets/Main/naigos_item.jpg";

interface ActivateServiceImpl {
  title: string;
  routerName: string;
  imgUrl?: string | null;
}

const activateServiceList = ref<ActivateServiceImpl[]>([
  {title: '奶果Naigos', routerName: 'Naigos', imgUrl: NaigosItem},
]);


const uploadExhibitionList = ref<any[]>([]);
</script>

<template>
  <div class="module upload_exhibition_box">
    <h4>代表内容（作品收录、学习笔记…等）</h4>
    <hr/>
    <div class="upload_exhibition_item" v-if="uploadExhibitionList.length !== 0"></div>
    <div class="upload_exhibition_item_no" v-else>当前版栏无内容</div>
  </div>
  <div class="module activate_service_box">
    <h4>服务范围</h4>
    <hr/>
    <div class="activate_service_item" v-for="(item, index) in activateServiceList" :key="index">
      <img v-if="item.imgUrl" :src="item.imgUrl" alt="item"/>
      <div v-else>{{item.title}}</div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.module::after
  content: ""
  display: block
  clear: both
.module
  width: 100%
  max-height: 350px
  overflow: auto
  //border: 1px solid #f0d4eb
  margin-bottom: 20px
  h4
    margin: 0
    color: #666
  hr
    margin: .6rem auto
    border: #f0d4eb .1px solid
  .upload_exhibition_item_no
    text-align: center
    color: #666
    letter-spacing: 1px
    height: 50px
  .activate_service_item
    margin-right: 20px
    float: left
    width: 180px
    height: 90px
    overflow: hidden
    border-radius: 10px
    img
      width: 100%
    div
      height: 100%
      border: #f0d4eb 1px solid
</style>