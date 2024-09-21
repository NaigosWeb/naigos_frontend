<script setup lang="ts">
import {onBeforeUnmount, onMounted} from "vue";
import {tfsChange, bgvChange} from "@/utils/BlueArchive/BaTfsBgvUtil";

onMounted(() => {
  bgvChange(false);
})
onBeforeUnmount(() => {
  tfsChange();
})
</script>

<template>
  <div>
    2
  </div>
</template>

<style scoped lang="sass">

</style>