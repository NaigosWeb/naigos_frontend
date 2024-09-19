<script setup lang="ts">

import BaTransfromVComp from "@/components/BlueArchive/BaTransfromVComp.vue";
import {ref, watch} from "vue";
import {useTransfromStatus} from "@/stores/BlueArchive/TransfromStatus";
const transfromStatus = useTransfromStatus();

const isTfsComp = ref(false);

watch(() => transfromStatus.isTransfromStatus, (newValue) => {
  isTfsComp.value = newValue;
})
</script>

<template>
  <div class="bg_box">
    <video class="mian_bgv" src="@/assets/BlueArchive/loop_l_tw.mp4" autoplay loop muted/>
    <img class="zhezhao_bg" src="@/assets/BlueArchive/zhezhao.png" alt="遮罩"/>
    <BaTransfromVComp v-if="isTfsComp"/>
  </div>
</template>

<style scoped lang="sass">
.bg_box
  width: 100vw
  height: 100vh
  overflow: hidden
  position: fixed
  z-index: -1
  .mian_bgv
    width: 100%
    min-height: 100%
    z-index: -1
    position: absolute
  .zhezhao_bg
    min-width: 100%
    min-height: 100%
    width: 100%
    position: absolute
    top: 0
    left: 0
</style>