<script setup lang="ts">
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
const userDetailStore = useUserDetailStore();
import WManageHeaderComp from "@/components/WebManage/WManageHeaderComp.vue";
import WManageSideMenuComp from "@/components/WebManage/WManageSideMenuComp.vue";
import {onMounted, ref} from "vue";
import {hasPermission} from "@/utils/UserPermi/IsPermiUtil";
import {PermiConst} from "@/constant/PermiConst";
import router from "@/router";
import type {UserPermiImpl} from "@/interfaces/UserPermiImpl";

const userPermi = ref<UserPermiImpl>(userDetailStore.userPermi);

onMounted(() => {
  if (!window.localStorage.getItem("token") || !hasPermission(
      userPermi.value.permissions, PermiConst().MANAGER)) {
    console.log('权限检查', hasPermission(userPermi.value.permissions, PermiConst().MANAGER))
    router.back();
  }
})
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