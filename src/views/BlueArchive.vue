<script setup lang="ts">

import BaBgVComp from "@/components/BlueArchive/BaBgs/BaBgVComp.vue";
import BaHeaderComp from "@/components/BlueArchive/BaHeaderComp.vue";
import BaTransfromVComp from "@/components/BlueArchive/BaBgs/BaTransfromVComp.vue";

</script>

<template>
  <BaBgVComp/>
  <BaTransfromVComp/>
  <BaHeaderComp/>
  <router-view/>
</template>

<style scoped lang="sass">
.container
  height: calc(100vh - 8rem)
</style>