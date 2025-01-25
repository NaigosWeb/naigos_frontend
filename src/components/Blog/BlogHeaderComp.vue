<script setup lang="ts">
import defaultAvatar from "@/assets/Main/avatar.jpg";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import {ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
const userDetailStore = useUserDetailStore();

interface ItemImpl {
  title: string; router_name: string; href?: string;
}

const itemList: Array<ItemImpl> = [
  {title: '博客管理', router_name: 'BlogManage', href: `https://udus.naigos.cn/replace?token=${window.localStorage.getItem('token')}&target=Blog`}
]

const userArchive = ref<UserArchiveImpl>(userDetailStore.userDetails);

const itemClicked = (item: ItemImpl) => {
  switch (item.router_name) {
    case 'BlogManage': {
      if (item.href) {
        window.location.href = item.href;
      }
      break;
    }
    default: break;
  }
}

watch(() => userDetailStore.userDetails, (newVal: UserArchiveImpl) => {
  userArchive.value = newVal;
})
</script>

<template>
  <header class="blog_header">
    <img class="blog_header_user_avatar" :src="userArchive.avatar || defaultAvatar" alt="avatar"/>
    <div class="blog_header_item_box">
      <div class="blog_header_item" v-for="(item, index) in itemList" :key="index" @click="itemClicked(item)">{{item.title}}</div>
    </div>
  </header>
</template>

<style scoped lang="sass">
@keyframes blog_header_in
  0%
    opacity: 0
    transform: translateX(-20px)
  100%
    opacity: 1
    transform: translateX(0)
@mixin blog_header_in_ani
  animation: blog_header_in .8s ease forwards
.blog_header
  @include blog_header_in_ani()
  width: 70%
  height: 80px
  background-color: #f0d4eb
  border-radius: 0 0 80px 0
  display: flex
  align-items: center
  padding-left: 1%
  .blog_header_user_avatar
    height: 80%
    border: white 3px solid
    border-radius: 10px
    box-shadow: #57505d 0 0 5px
</style>