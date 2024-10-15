<script setup lang="ts">
import blueArchiveAboutItem from "@/assets/Main/blue_archive_about_item.jpg";
import applyNaigosItem from "@/assets/Main/apply_naigos_item.jpg";
import naigosItem from "@/assets/Main/naigos_item.jpg";
import themeItem from "@/assets/Main/theme_item.jpg";
import beautifyItem from "@/assets/Main/beautify_item.jpg";
import {useRouter} from "vue-router";
const router = useRouter();

interface itemImpl {
  title: string;
  routerUrl: string;
  imgUrl?: any;
}
const itemList: itemImpl[] = [
  {title: '奶果Naigos', routerUrl: '/naigos', imgUrl: naigosItem},
  {title: '主题包', routerUrl: '/theme', imgUrl: themeItem},
  {title: '美化皮肤', routerUrl: '/beautify', imgUrl: beautifyItem},
  {title: '蔚蓝档案相关', routerUrl: '/blue_archive', imgUrl: blueArchiveAboutItem},
  {title: '加入奶果', routerUrl: '/apply', imgUrl: applyNaigosItem},
]

const itemClicked = (target: string) => {
  router.push(target);
}
</script>

<template>
  <div class="item_box">
    <div class="item" v-for="(item, index) in itemList" :key="index" :title="item.title" @click="itemClicked(item.routerUrl)">
      <img :src="item?.imgUrl" alt="img"/>
    </div>
  </div>
</template>

<style scoped lang="sass">
@keyframes item_box_in
  0%
    opacity: 0
    transform: translateY(20px)
  100%
    opacity: 1
    transform: translateY(0)
@mixin item_box_in_ani()
  animation: item_box_in
  animation-duration: .8s
  animation-delay: .5s
  animation-fill-mode: forwards
.item_box
  width: 100%
  display: flex
  justify-content: space-between
  opacity: 0
  transform: translateY(20px)
  margin-bottom: 30px
  @include item_box_in_ani()
  .item:hover
    opacity: 1
    cursor: pointer
    box-shadow: white 0 0 10px
  .item
    width: 180px
    height: 90px
    background-color: #9cfafd
    border-radius: 10px
    overflow: hidden
    opacity: .8
    transition: opacity .5s ease, cursor .5s ease, box-shadow .3s ease
</style>