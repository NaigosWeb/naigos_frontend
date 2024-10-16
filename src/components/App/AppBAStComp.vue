<script setup lang="ts">
import aronaSt from "@/assets/BlueArchive/BA_System_arona.webm";
import puranaSt from "@/assets/BlueArchive/BA_System_purana.webm";
import {ref} from "vue";

const selectSt = ref<any>(Math.floor(Math.random() * 10) < 5? aronaSt: puranaSt);

</script>

<template>
  <div class="st_box">
    <video class="stv" :src="selectSt" autoplay muted/>
  </div>
</template>

<style scoped lang="sass">
.st_box
  z-index: 99
  position: fixed
  width: 100%
  height: 100vh
  overflow: hidden
  .stv
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    min-height: 100%
</style>