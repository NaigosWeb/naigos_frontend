<script setup lang="ts">
import defaultAvatar from "@/assets/Main/avatar.jpg";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import {ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
const userDetailStore = useUserDetailStore();

const userArchive = ref<UserArchiveImpl>(userDetailStore.userDetails);

watch(() => userDetailStore.userDetails, (newVal: UserArchiveImpl) => {
  userArchive.value = newVal;
})
</script>

<template>
  <header class="blog_header">
    <div class="blog_header_user">
      <img class="blog_header_user_avatar" :src="userArchive.avatar || defaultAvatar" alt="avatar"/>
      <div  class="blog_header_user_archive">
        <p>{{userArchive.nickname}}</p>
        <p>{{userArchive.email}}</p>
      </div>
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
  .blog_header_user
    height: 100%
    display: flex
    align-items: center
    .blog_header_user_avatar
      height: 80%
      border: white 3px solid
      border-radius: 10px
      box-shadow: #57505d 0 0 5px
</style>