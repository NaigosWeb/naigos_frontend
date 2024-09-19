<script setup lang="ts">
import {useTransfromStatus} from "@/stores/BlueArchive/TransfromStatus";
const transfromStatus = useTransfromStatus();
import {onBeforeUnmount} from "vue";

onBeforeUnmount(() => {
  transfromStatus.changeTransfromStatus();
  setTimeout(() => {
    transfromStatus.changeTransfromStatus();
  }, 2000)
})
</script>

<template>
  <div>
    default
  </div>
</template>

<style scoped lang="sass">

</style>