<script setup lang="ts">
import banner1 from "@/assets/Main/banner.jpg";
import banner2 from "@/assets/Main/banner2.jpg";
import banner3 from "@/assets/Main/banner3.jpg";

const bannerList = [banner1, banner2, banner3];
</script>

<template>
<!--  <div class="banner_box">-->
<!--    <img src="@/assets/Main/banner.jpg" alt="banner" />-->
<!--  </div>-->
  <div class="banner_box">
    <el-carousel :interval="5000" type="card" height="300px" pause-on-hover>
      <el-carousel-item v-for="item in bannerList" :key="item">
        <img :src="item" alt="banner" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
  border-radius: 20px
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
  border-radius: 20px;
  box-shadow: #57505d 0 0 10px;
}
</style>
<style scoped lang="sass">
@keyframes banner_box_in
  0%
    transform: translateY(20px)
  100%
    transform: translateY(0)
@mixin banner_box_in_ani()
  animation: banner_box_in
  animation-duration: .8s
  animation-fill-mode: forwards
.banner_box:hover
  opacity: 1
.banner_box
  opacity: .8
  width: 100%
  max-height: 300px
  margin-bottom: 30px
  overflow: hidden
  transition: opacity .8s ease
  @include banner_box_in_ani()
  position: relative
  img
    //width: 100%
    min-height: 100%
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    min-width: 100%
</style>