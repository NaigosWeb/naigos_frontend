<script setup lang="ts">
import {ref, watch} from "vue";
import {useTransfromBgvStatus} from "@/stores/BlueArchive/TransfromBgvStatus";
const transfromBgvStatus = useTransfromBgvStatus();

const isBgvComp = ref(true);

watch(() => transfromBgvStatus.isMainBgvStatus, (newValue) => {
  isBgvComp.value = newValue;
})

</script>

<template>
  <div class="bg_box">
    <div v-if="isBgvComp">
      <video  class="mian_bgv" src="../../../assets/BlueArchive/output1080_60_5k.mp4" autoplay loop muted/>
      <img class="zhezhao_bg" src="../../../assets/BlueArchive/zhezhao.png" alt="遮罩"/>
    </div>

    <video v-else class="sub_bgv" src="../../../assets/BlueArchive/home1.mp4" autoplay loop muted/>

  </div>
</template>

<style scoped lang="sass">
.bg_box
  min-width: 100vw
  height: 100vh
  overflow: hidden
  position: fixed
  z-index: -1
  .mian_bgv
    min-width: 100%
    min-height: 100vh
    z-index: -10
    position: absolute
    top: 0
    left: 0
  .zhezhao_bg
    min-width: 100%
    min-height: 100%
    width: 100%
    position: absolute
    top: 0
    left: 0
    z-index: -1
</style>