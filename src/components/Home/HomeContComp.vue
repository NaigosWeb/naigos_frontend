<script setup lang="ts">
import HomeItemComp from "@/components/Home/HomeItemComp.vue";
import HomeBannerComp from "@/components/Home/HomeBannerComp.vue";
import HomeNMComp from "@/components/Home/NoticeMessage/HomeNMComp.vue";
</script>

<template>
  <div class="container_box">
    <div class="empty_box"/>
    <div class="container">
      <HomeBannerComp/>
      <HomeItemComp/>
      <HomeNMComp/>
    </div>
  </div>
</template>

<style scoped lang="sass">

.container_box
  background-color: #57505d10
  height: 100vh
  width: 100vw
  .empty_box
    width: 100vw
    height: calc(90px + 30px)
  .container
    width: 90%
    margin: 0 auto
</style>