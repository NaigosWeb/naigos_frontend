<script setup lang="ts">
import {onBeforeUnmount, onMounted} from "vue";
import {tfsChange, bgvChange} from "@/utils/BlueArchive/BaTfsBgvUtil";

onMounted(() => {
  bgvChange(true);

})

onBeforeUnmount(() => {
  tfsChange();
})


</script>

<template>
  <div>
  </div>
</template>

<style scoped lang="sass">

</style>