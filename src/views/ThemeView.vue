<script setup lang="ts">
import banner1 from "@/assets/Theme/banner1.jpg";
import banner2 from "@/assets/Theme/banner2.jpg";
import ThemeHeaderComp from "@/components/Theme/ThemeHeaderComp.vue";

const themeClassifyList: Array<{title: string; routeName: string; cover_image: string}> = [
  {title: '战舰世界', routeName: 'ThemeWows', cover_image: ''},
]
const bannerList: Array<any> = [banner1, banner2];
</script>

<template>
  <ThemeHeaderComp/>
  <div class="container">
    <div class="block text-center">
      <el-carousel height="300px">
        <el-carousel-item v-for="item in bannerList" :key="item">
          <img :src="item" alt="banner"/>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="item_box">
      <div class="item" v-for="(item, index) in themeClassifyList" :key="index">{{item.title}}</div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.container
  .text-center
    box-shadow: #57505d50 0 3px 3px
.item_box
  width: 90%
  margin: 50px auto 0 auto
  display: flex
  .item
    border-radius: 10px
    width: 300px
    height: 400px
    border: #57505d solid 1px
    background-color: #f0d4eb50
</style>