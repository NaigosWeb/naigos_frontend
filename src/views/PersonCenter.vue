<script setup lang="ts">

import TopHeader from "@/components/HeaderFooter/TopHeader.vue";
import UserBanner from "@/components/PersonCenter/UserBanner.vue";
import {onMounted, ref} from "vue";
import { usePersonStore } from '@/stores/PersonCenter'
const store = usePersonStore()
import {useRouter} from "vue-router";
const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token){
    store.fetchPersonCenter(token);
  } else{
    router.back();
  }
})

</script>

<template>
  <TopHeader/>
  <UserBanner/>
</template>

<style scoped lang="sass">

</style>