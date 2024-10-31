<script setup lang="ts">
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
const userDetailStore = useUserDetailStore();
import WManageHeaderComp from "@/components/WebManage/WManageHeaderComp.vue";
import WManageSideMenuComp from "@/components/WebManage/WManageSideMenuComp.vue";
import {onMounted, ref, watch} from "vue";
import {hasPermission} from "@/utils/UserPermi/IsPermiUtil";
import {PermiConst} from "@/constant/PermiConst";
import {useRouter} from "vue-router";
const router = useRouter();
import type {UserPermiImpl} from "@/interfaces/UserPermiImpl";

onMounted(() => {
  if (!window.localStorage.getItem("token")) {
    router.back();
  }
})
watch(() => userDetailStore.userPermi, (newVal: UserPermiImpl) => {
  if (!hasPermission(newVal.permissions, PermiConst().MANAGER)){
    router.back();
  }
  console.log('权限检查',newVal.permissions, hasPermission(newVal.permissions, PermiConst().MANAGER))
})
</script>

<template>
  <WManageHeaderComp/>
  <div class="left_right_box">
    <WManageSideMenuComp/>
    <RouterView/>
  </div>
</template>

<style scoped lang="sass">
.left_right_box
  display: flex
</style>