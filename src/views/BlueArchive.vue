<script setup lang="ts">

import BaBgVComp from "@/components/BlueArchive/BaBgVComp.vue";
import BaHeaderComp from "@/components/BlueArchive/BaHeaderComp.vue";

</script>

<template>
  <BaBgVComp/>
  <BaHeaderComp/>
  <div class="container">
    <router-view/>
  </div>
</template>

<style scoped lang="sass">
.container
  height: calc(100vh - 5.3rem)
</style>