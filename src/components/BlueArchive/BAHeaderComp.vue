<script setup lang="ts">
import {useRouter} from "vue-router";
const router = useRouter();
import {useBATransStore} from "@/stores/BlueArchive/BATransStore";
const baTransStore = useBATransStore();
import {useBABgvStore} from "@/stores/BlueArchive/BABgvStore";
const baBgvStore = useBABgvStore();
import {useBAMockRouterStore} from "@/stores/BlueArchive/BAMockRouterStore";
const baMockRouterStore = useBAMockRouterStore();

interface itemImpl {
  title: string;
  routerUrl: string;
}

const itemList: itemImpl[] = [
  {title: '主页', routerUrl: 'home'},
  {title: '二创', routerUrl: 're_create'},
  {title: '收录', routerUrl: 'record'},
  {title: '反馈', routerUrl: 'feedback'},
]

const itemClicked = (target: string) => {
  if (target === 'home') {
    baTransStore.changeBATransShow(true);
    setTimeout(() => {
      baBgvStore.changeHomeBgvShow(true);
      baMockRouterStore.changeMockRouter(target);
    }, 800);
    setTimeout(() => {
      baTransStore.changeBATransShow(false);
    }, 1300);
  } else {
    baTransStore.changeBATransShow(true);
    setTimeout(() => {
      baBgvStore.changeHomeBgvShow(false);
      baMockRouterStore.changeMockRouter(target);
    }, 800);
    setTimeout(() => {
      baTransStore.changeBATransShow(false);
    }, 1300);
  }
}
</script>

<template>
  <header class="header">
    <img class="logo" src="@/assets/BlueArchive/logo_2.e1693a80.png" alt="logo"/>
    <div class="item_box">
      <div class="item" v-for="(item, index) in itemList" :key="index" @click="itemClicked(item.routerUrl)">{{item.title}}</div>
    </div>
  </header>
</template>

<style scoped lang="sass">
.header
  width: 100%
  position: fixed
  height: 6.3rem
  display: flex
  z-index: 19
  .item_box
    display: flex
    position: absolute
    gap: 100px
    right: 5%
    top: 50%
    transform: translateX(-50%)
    .item:hover
      cursor: pointer
    .item
      font-size: 1.2rem
      letter-spacing: .5rem
      font-weight: bold
  .logo
    position: absolute
    top: 2.3rem
    left: 4.3rem
    height: 100%
</style>