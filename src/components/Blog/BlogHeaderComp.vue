<script setup lang="ts">
import defaultAvatar from "@/assets/Main/avatar.jpg";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import {ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
const userDetailStore = useUserDetailStore();
import {useRouter} from "vue-router";
const router = useRouter();

interface ItemImpl {
  title: string; router_name: string;
}

const itemList: Array<ItemImpl> = [
  {title: '博客管理', router_name: 'Blog'},
  {title: '上传博客', router_name: 'BlogUpload'},
  {title: '返回', router_name: 'BlogReturn'}
]

const userArchive = ref<UserArchiveImpl>(userDetailStore.userDetails);

const itemClicked = (item: ItemImpl) => {
  let baseUrl: string = `https://udus.naigos.cn/replace?token=${window.localStorage.getItem('token')}&target=`;
  switch (item.router_name) {
    case 'BlogReturn': {
      router.back();
      break;
    }
    default: {
      window.location.href = baseUrl + item.router_name;
      break;
    }
  }
}
const avatarClicked = () => {
  router.push({name: 'PersonalCenter'});
}

watch(() => userDetailStore.userDetails, (newVal: UserArchiveImpl) => {
  userArchive.value = newVal;
})
</script>

<template>
  <header class="blog_header">
    <div class="blog_header_left">
      <img class="blog_header_user_avatar" @click="avatarClicked" :src="userArchive.avatar || defaultAvatar" alt="avatar"/>
      <div class="blog_header_item_box">
        <div class="blog_header_item" v-for="(item, index) in itemList" :key="index" @click="itemClicked(item)">
          {{item.title}}
        </div>
      </div>
    </div>
    <div class="blog_header_right">
      <input class="blog_header_search_input" type="text" placeholder="输入关键词，多个关键词利用#号分割"/>
      <button class="blog_header_search_button">标题检索</button>
      <button class="blog_header_search_button">标签检索</button>
      <button class="blog_header_search_button">作者检索</button>
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
  gap: 30px
  .blog_header_left
    box-shadow: #b46893 5px 5px 30px
    width: 700px
    height: 80px
    background-color: #ffe4b6
    border-radius: 0 0 80px 0
    display: flex
    align-items: center
    padding-left: 1%
    gap: 30px
    .blog_header_user_avatar
      height: 80%
      border: white 3px solid
      border-radius: 10px
      box-shadow: #57505d 0 0 5px
    .blog_header_item_box
      display: flex
      align-items: center
      gap: 10px
      .blog_header_item:hover
        background-color: rgba(201, 45, 115, .5)
        cursor: pointer
      .blog_header_item
        color: #fff
        background-color: rgb(243, 198, 221)
        border: 2px solid rgb(255, 255, 255)
        border-radius: 20px
        transition: background-color .3s ease
        padding: 5px 20px
        font-size: 18px
  .blog_header_right
    margin-right: 30px
    flex: 1
    display: flex
    flex-direction: row
    gap: 20px
    justify-content: center
    .blog_header_search_input[type="text"]:focus
      background-color: rgba(255, 255, 255, 1)
    .blog_header_search_input[type="text"]::placeholder
      color: rgb(68, 103, 149)
    .blog_header_search_input
      flex: 1
      //width: 400px
      border: 2px solid rgb(147, 179, 219)
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