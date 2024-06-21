<template>
  <div class="main_container">
    <div class="main_container_left">
      <SideMenu/>
    </div>
    <div class="main_container_right">
      <div class="main_container_bg_box">
        <img class="main_bg" id="main_bg_arona" src="@/assets/arona.jpg" alt="arona"/>
        <img class="main_bg" id="main_bg_purana" src="@/assets/purana.jpg" alt="purana"/>
      </div>
      <Header/>
      <MainContainer/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header/Header.vue";
import SideMenu from "@/components/SideMenu/SideMenu.vue";
import MainContainer from "@/components/MainContainer/MainContainer.vue";
</script>

<style scoped lang="sass">
.main_container
  display: grid
  grid-template-columns: 15% 85%
  .main_container_left
    border-right: 1px solid #949494
  .main_container_right
    position: relative
    #main_bg_arona
      position: fixed
      left: 15%
    #main_bg_purana
      position: fixed
      right: 0
    .main_bg
      height: 100vh
      z-index: -1
</style>