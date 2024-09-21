<script setup lang="ts">
import {useTransfromBgvStatus} from "@/stores/BlueArchive/TransfromBgvStatus";
import {ref, watch} from "vue";
const transfromBgvStatus = useTransfromBgvStatus();

const isTfs = ref(false);

watch(() => transfromBgvStatus.isTransfromStatus, (newValue) => {
  isTfs.value = newValue;
})
</script>

<template>
  <video v-if="isTfs" src="@/assets/BlueArchive/transfrom.webm" autoplay muted/>
</template>

<style scoped lang="sass">
video
  min-width: 100%
  min-height: 100vh
  pointer-events: none
  z-index: 999
  position: fixed
</style>