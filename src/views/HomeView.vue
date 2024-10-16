<script setup lang="ts">
import HomeBgComp from "@/components/Home/HomeBgComp.vue";
import HeaderComp from "@/components/HeaderFooter/HeaderComp.vue";
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
  <HeaderComp/>
  <HomeBgComp/>
  <HomeContComp/>
</template>

<style scoped lang="sass">
</style>