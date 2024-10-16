<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import BABgComp from "@/components/BlueArchive/BABgComp.vue";
import BAHeaderComp from "@/components/BlueArchive/BAHeaderComp.vue";
import {useBAMockRouterStore} from "@/stores/BlueArchive/BAMockRouterStore";
import BARecreaComp from "@/components/BlueArchive/BARecreate/RecreaComp.vue";
import BARecordComp from "@/components/BlueArchive/BARecord/RecordComp.vue";
const baMockRouterStore = useBAMockRouterStore();

const mockRouterComp = ref<string>('home');

watch(() => baMockRouterStore.mockRouter, (newVal: string) => {
  console.log('监听变化mockRouter：', newVal);
  mockRouterComp.value = newVal;
})
</script>

<template>
  <BAHeaderComp/>
  <BABgComp/>
  <BARecreaComp v-if="mockRouterComp === 're_create'"/>
  <BARecordComp v-if="mockRouterComp === 'record'"/>
</template>

<style scoped lang="sass">

</style>