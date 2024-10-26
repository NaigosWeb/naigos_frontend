<script setup lang="ts">
import PerCHeaderComp from "@/components/PersonalCenter/PerCHeaderComp.vue";
import {onMounted} from "vue";
import PerCLeftComp from "@/components/PersonalCenter/PerCLeftComp.vue";



onMounted(() => {
});
</script>

<template>
  <PerCHeaderComp/>
  <div class="left_right_box">
    <div class="left_box">
      <PerCLeftComp/>
    </div>
    <div class="right_box">
      <RouterView/>
    </div>
  </div>
</template>

<style scoped lang="sass">
.left_right_box
  margin-top: 50px
  display: flex
  .left_box
    margin-left: 10%
    width: 260px
  .right_box
    flex: 1
    margin: 0 10% 0 2%
</style>