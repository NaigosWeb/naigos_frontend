<script setup lang="ts">
import defaultAvatar from "@/assets/Main/avatar.jpg";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import {ref, watch} from "vue";
const userDetailStore = useUserDetailStore();

const avatar = ref<string | null>(userDetailStore.userAvatar);

watch(() => userDetailStore.userAvatar, newValue => {
  avatar.value = newValue;
});
</script>

<template>
  <header class="header">
    <img class="avatar" :src="avatar || defaultAvatar" alt="avatar"/>
    <img class="header_bg" src="@/assets/Apply/button_title_bg.svg" alt="bg"/>
    <span class="title">欢迎访问美化包主题！</span>
  </header>
</template>

<style scoped lang="sass">
.header
  width: 100%
  height: 60px
  background-color: #f0d4eb
  margin: 0 auto
  display: flex
  align-items: center
  position: relative
  .header_bg
    position: absolute
    width: 100%
  .avatar
    margin-left: 20px
    height: 80%
    border-radius: 50%
    border: #bc9bb6 1px solid
    z-index: 1
  .title
    margin: 0 20px 0 auto
    color: white
    font-weight: bold
    font-size: 18px
    letter-spacing: 1px
    z-index: 1
</style>