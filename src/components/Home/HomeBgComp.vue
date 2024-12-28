<script setup lang="ts">
import BGSky from "@/assets/Main/bg_sky_1080.jpg";
import BGSkyNight from "@/assets/Main/bg_sky_night_1080.jpg"
import arona from "@/assets/Main/arona.png";
import purana from "@/assets/Main/purana.png";
import zhezhao from "@/assets/Main/zhezhao.png";
import {onMounted, ref} from "vue";

import christmas1 from "@/assets/Main/christmas_bg_1.jpg";
import christmas2 from "@/assets/Main/christmas_bg_2.jpg";

const selectBg = ref<any | null>(null);
const isShowAronaPurana = ref<boolean>(true);

const handleSelectBg = () => {
  const date = new Date();
  // const hour = 12;
  const hour = date.getHours();
  if (6 <= hour && hour <= 18) selectBg.value = BGSky as any;
  else selectBg.value = BGSkyNight as any;
}
const handleFestivalBg = () => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month === 12 && 24 <= day) || (month === 1 && day <= 3)){
    if ((Math.floor(Math.random() * 2) + 1) === 1){
      selectBg.value = christmas1;
    } else selectBg.value = christmas2;
  }
  isShowAronaPurana.value = false;
}

onMounted(() => {
  handleSelectBg();
  handleFestivalBg();
})
</script>

<template>
  <div class="bg_box">
    <img class="bg" :src="selectBg" alt="bg" />
    <img v-if="isShowAronaPurana" class="arona" :src="arona" alt="arona" />
    <img v-if="isShowAronaPurana" class="purana" :src="purana" alt="purana" />
    <img class="zhezhao" :src="zhezhao" alt="zhezhao" />
  </div>
</template>

<style scoped lang="sass">
.bg_box
  position: fixed
  width: 100vw
  height: 100vh
  overflow: hidden
  z-index: -1
  .bg
    position: absolute
    left: 0
    top: 0
    min-width: 100%
  .arona
    position: absolute
    left: 0
    height: 100%
  .purana
    position: absolute
    right: 0
    height: 100%
  .zhezhao
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100vh
</style>