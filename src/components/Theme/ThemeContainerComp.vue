<script setup lang="ts">
import banner1 from "@/assets/Theme/banner1.jpg";
import banner2 from "@/assets/Theme/banner2.jpg";

const bannerList: Array<any> = [banner1, banner2];
</script>

<template>
  <div class="container">
    <div class="block text-center">
      <el-carousel height="300px">
        <el-carousel-item v-for="item in bannerList" :key="item">
          <img :src="item" alt="banner"/>
        </el-carousel-item>
      </el-carousel>
    </div>
    <RouterView/>
  </div>
</template>

<style scoped lang="sass">
.container
  max-height: calc(100vh - 60px)
  overflow: auto
  .block
    box-shadow: #57505d50 0 3px 3px
</style>