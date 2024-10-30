<script setup lang="ts">

import WManageHeaderComp from "@/components/WebManage/WManageHeaderComp.vue";
import WManageSideMenuComp from "@/components/WebManage/WManageSideMenuComp.vue";
</script>

<template>
  <WManageHeaderComp/>
  <div class="left_right_box">
    <WManageSideMenuComp/>
    <div>asd</div>
  </div>
</template>

<style scoped lang="sass">
.left_right_box
  display: flex
</style>