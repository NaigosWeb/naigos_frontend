<script setup lang="ts">
import {useBABgvStore} from "@/stores/BlueArchive/BABgvStore";
import {onMounted, ref, watch} from "vue";
const baBgvStore = useBABgvStore();

const homeBgvShow = ref<boolean>(true);

onMounted(() => {
  if (baBgvStore.isHomeBgvShow) homeBgvShow.value = baBgvStore.isHomeBgvShow;
})

watch(() => baBgvStore.isHomeBgvShow, (newVal: boolean) => {
  homeBgvShow.value = newVal;
})
</script>

<template>
  <div class="bg_box">
    <img v-if="homeBgvShow" class="bgi" src="@/assets/BlueArchive/bgi.jpg" alt="bgi">
    <img v-if="homeBgvShow" class="zhezhao" src="@/assets/BlueArchive/zhezhao.png" alt="zhezhao"/>
    <video v-else class="bgv" src="@/assets/BlueArchive/home1.mp4" type="video/mp4" autoplay muted loop/>
  </div>
</template>

<style scoped lang="sass">
.bg_box
  position: fixed
  width: 100%
  height: 100vh
  overflow: hidden
  z-index: -5
  .bgv
    min-height: 100%
  .bgi
    min-height: 100%
  .zhezhao
    position: absolute
    top: 0
    left: 0
    min-height: 100%
    width: 100%
</style>