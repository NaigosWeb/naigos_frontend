<script setup lang="ts">
import BGSky from "@/assets/Main/bg_sky_1080.jpg";
import BGSkyNight from "@/assets/Main/bg_sky_night_1080.jpg"
import arona from "@/assets/Main/arona.png";
import purana from "@/assets/Main/purana.png";
import zhezhao from "@/assets/Main/zhezhao.png";
import {onMounted, ref} from "vue";

const selectBg = ref<any | null>(null);

const handleSelectBg = () => {
  const date = new Date();
  // const hour = 12;
  const hour = date.getHours();
  if (6 <= hour && hour <= 18) selectBg.value = BGSky as any;
  else selectBg.value = BGSkyNight as any;
}

onMounted(() => {
  handleSelectBg();
})
</script>

<template>
  <div class="bg_box">
    <img class="bg" :src="selectBg" alt="bg" />
    <img class="arona" :src="arona" alt="arona" />
    <img class="purana" :src="purana" alt="purana" />
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