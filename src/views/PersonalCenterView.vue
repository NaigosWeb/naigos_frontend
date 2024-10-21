<script setup lang="ts">
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
const userDetailStore = useUserDetailStore();
import PerCHeaderComp from "@/components/PersonalCenter/PerCHeaderComp.vue";
import {onMounted, ref} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";

const userArchive = ref<UserArchiveImpl>({...userDetailStore.userDetails});

onMounted(() => {
  userArchive.value = userDetailStore.userDetails as UserArchiveImpl;
})
</script>

<template>
  <PerCHeaderComp/>
  <img :src="userArchive.avatar" alt="avatar"/>
  <div>{{userArchive}}</div>
</template>

<style scoped lang="sass">

</style>