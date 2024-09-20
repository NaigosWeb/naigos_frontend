<script setup lang="ts">

import BaTransfromVComp from "@/components/BlueArchive/BaTransfromVComp.vue";
import {onMounted, ref, watch} from "vue";
import {useTransfromBgvStatus} from "@/stores/BlueArchive/TransfromBgvStatus";
const transfromStatus = useTransfromBgvStatus();

const isTfsComp = ref(false);
const isBgvComp = ref(true);

onMounted(() => {
  isBgvComp.value = true;
})

watch([
  () => transfromStatus.isTransfromStatus,
  () => transfromStatus.isMainBgvStatus
], (
    [newTranfromStatus, newMainBgvStatus], [oldTranfromStatus, oldMainBgvStatus]
) => {
  if (newTranfromStatus !== oldTranfromStatus) {
    isTfsComp.value = newTranfromStatus;
  }
  isBgvComp.value = newMainBgvStatus;
})
</script>

<template>
  <div class="bg_box">
    <video v-if="isBgvComp" class="mian_bgv" src="@/assets/BlueArchive/output.mp4" autoplay loop muted/>
    <video v-if="!isBgvComp" class="sub_bgv" src="@/assets/BlueArchive/home1.mp4" autoplay loop muted/>
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
    z-index: -10
    position: absolute
  .zhezhao_bg
    min-width: 100%
    min-height: 100%
    width: 100%
    position: absolute
    top: 0
    left: 0
    z-index: -1
</style>