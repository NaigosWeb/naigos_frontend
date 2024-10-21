<script setup lang="ts">
import ApplyBgComp from "@/components/Apply/ApplyBgComp.vue";
import ApplyHeaderComp from "@/components/Apply/ApplyHeaderComp.vue";
import ApplyBandIComp from "@/components/Apply/ApplyBandIComp.vue";

</script>

<template>
  <div class="container">
    <ApplyBgComp/>
    <ApplyHeaderComp/>
    <RouterView/>
  </div>
</template>

<style scoped lang="sass">

.container
  position: relative
  width: 100%
  height: 100vh

</style>