<script setup lang="ts">
import {useBAStStore} from "@/stores/BlueArchive/BAStStore";
const baStStore = useBAStStore();
import naigosItem from "@/assets/Main/naigos_item.jpg";
import {onMounted, ref} from "vue";
import {httpSpring} from "@/utils/http";
import {useRouter} from "vue-router";
const router = useRouter();

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

interface ServiceScopeImpl {
  service_name: string;
  url: string;
  router: string;
  cover_image: string | any;
}

const itemClicked = (routerName: string) => {
  if (routerName === 'BlueArchive'){
    baStStore.changeBAStShow(true);
    setTimeout(() => {
      baStStore.changeBAStShow(false);
      router.push({name: routerName});
    }, 1800);
  } else {
    router.push({name: routerName});
  }
}

const userServiceScopeList = ref<ServiceScopeImpl[]>([
  {service_name: 'naigos', url: 'https://naigos.cn/naigos', router: 'Naigos', cover_image: naigosItem},
]);

onMounted(() => {
  fetchServiceScope();
  initBaStore();
})

const fetchServiceScope = () => {
  httpSpring({
    url: 'users/service_scope/me',
    method: "GET",
    headers: {Authorization: window.localStorage.getItem('token')}
  }).then(res => {
    if (res?.data?.code === 0) {
      userServiceScopeList.value = res?.data?.data;
    }
  }).catch(err => {
    console.error(err);
  })
}
</script>

<template>
  <div @click="itemClicked(item.router)" class="activate_service_item" v-for="(item, index) in userServiceScopeList" :key="index">
    <img v-if="item.cover_image" :src="item.cover_image" alt="item"/>
    <div v-else>{{item.service_name}}</div>
  </div>
</template>

<style scoped lang="sass">
.activate_service_item
  margin-right: 20px
  float: left
  width: 180px
  height: 90px
  overflow: hidden
  border-radius: 10px
  transition: .3s ease
  img
    width: 100%
  div
    height: 100%
    border: #f0d4eb 1px solid
.activate_service_item:hover
  transform: translateY(-3px)
  box-shadow: #57505d70 0 0 10px
  cursor: pointer
</style>