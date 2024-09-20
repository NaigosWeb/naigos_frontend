<script setup lang="ts">
import {onBeforeUnmount, onMounted} from "vue";
import {tfsChange} from "@/utils/BlueArchive/BaTfsUtil";
import {bgvChange} from "@/utils/BlueArchive/BaBgvUtil";
import {useTransfromBgvStatus} from "@/stores/BlueArchive/TransfromBgvStatus";
const transfromBgvStatus = useTransfromBgvStatus();

onMounted(() => {
  transfromBgvStatus.changeMainBgvStatus(false);
})
onBeforeUnmount(() => {
  tfsChange();
})
</script>

<template>
  <div>1</div>
</template>

<style scoped lang="sass">
</style>