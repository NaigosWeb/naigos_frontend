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
    <div class="blog_header_left">
      <img class="blog_header_user_avatar" :src="userArchive.avatar || defaultAvatar" alt="avatar"/>
      <div class="blog_header_item_box">
        <div class="blog_header_item" v-for="(item, index) in itemList" :key="index" @click="itemClicked(item)">{{item.title}}</div>
      </div>
    </div>
    <div class="blog_header_right">
      <input class="blog_header_search_input" type="text" placeholder="输入关键字"/>
      <button class="blog_header_search_button">关键词检索</button>
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
  display: flex
  align-items: center
  .blog_header_left
    width: 60%
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
  .blog_header_right
    flex: 1
    display: flex
    flex-direction: row
    gap: 20px
    justify-content: center
    .blog_header_search_input[type="text"]:focus
      background-color: rgba(255, 255, 255, 1)
    .blog_header_search_input[type="text"]::placeholder
      color: rgb(201, 45, 115)
    .blog_header_search_input
      flex: 1
      //width: 400px
      border: 2px solid rgba(222, 145, 169, 1)
      background-color: rgba(255, 255, 255, 0.5)
      padding: 10px
      font-size: 16px
      outline: none
      transition: background-color 0.3s ease
      border-radius: 20px
    .blog_header_search_button
      border-radius: 20px
      transition: background-color .3s ease
      padding: 0 20px
      font-size: 18px
      color: rgb(201, 45, 115)
      background-color: rgba(201, 45, 115, .1)
      border: 2px solid rgba(222, 145, 169, 1)
    .blog_header_search_button:hover
      background-color: rgba(255, 255, 255, 1)
      cursor: pointer
</style>