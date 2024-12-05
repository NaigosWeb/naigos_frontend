<script setup lang="ts">
import HomeHeaderComp from "@/components/HeaderFooter/HomeHeaderComp.vue";
import HomeFoorterComp from "@/components/HeaderFooter/HomeFoorterComp.vue";
import HomeBgComp from "@/components/Home/HomeBgComp.vue";
import HomeContComp from "@/components/Home/HomeContComp.vue";
import {onMounted} from "vue";
import {useBATransStore} from "@/stores/BlueArchive/BATransStore";
const baTransStore = useBATransStore();
import {useBABgvStore} from "@/stores/BlueArchive/BABgvStore";
const baBgvStore = useBABgvStore();
import {useBAMockRouterStore} from "@/stores/BlueArchive/BAMockRouterStore";
const baMockRouterStore = useBAMockRouterStore();

const initBaStore = () => {
  baTransStore.changeBATransShow(false);
  baBgvStore.changeHomeBgvShow(true);
  baMockRouterStore.changeMockRouter('home');
}

onMounted(() => {
  initBaStore();
})
</script>

<template>
  <HomeHeaderComp/>
  <HomeBgComp/>
  <HomeContComp/>
  <HomeFoorterComp/>
</template>

<style scoped lang="sass">
</style>