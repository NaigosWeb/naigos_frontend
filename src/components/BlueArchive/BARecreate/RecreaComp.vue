<script setup lang="ts">
import RecreatTitleComp from "@/components/BlueArchive/BARecreate/RecreaTitleComp.vue";
import RecreaContComp from "@/components/BlueArchive/BARecreate/RecreaContComp.vue";
import {useBARecreateSgthemeStore} from "@/stores/BlueArchive/Recreate/RecreaSgthemeStore";
import {ref, watch} from "vue";
const baRecreateSgthemeStore = useBARecreateSgthemeStore();

interface ControlSgthemeDetailShowImpl {
  isDetailShow: boolean;
  detailsName: string;
}

const controlSgthemeDetailShow = ref<ControlSgthemeDetailShowImpl>({
  isDetailShow: false,
  detailsName: "",
});

watch([
  () => baRecreateSgthemeStore.isDetailShow,
  () => baRecreateSgthemeStore.detailName,
], ([newIsShow, newDetailName]) => {
  controlSgthemeDetailShow.value.isDetailShow = newIsShow;
  controlSgthemeDetailShow.value.detailsName = newDetailName;
})
</script>

<template>
  <div class="container">
    <RecreatTitleComp/>
    <RecreaContComp/>
  </div>
</template>

<style scoped lang="sass">
.container
  width: 100%
  height: 100vh
  position: relative
</style>