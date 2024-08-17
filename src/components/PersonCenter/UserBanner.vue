<script setup lang="ts">
import originUserBanner from '@/assets/PersonCenter/banner_bg.jpg';
import originAvatar from '@/assets/avatar.jpg';
import { usePersonStore } from '@/stores/PersonCenter'
import { ref, watch} from "vue";
const store = usePersonStore()

const userBanner = ref(originUserBanner);
const avatar = ref(originAvatar),
    nickname = ref('');

watch(() => store.data, (newData) => {
  avatar.value = store.data.avatar;
  nickname.value = store.data.nickname;
  console.log(avatar.value);
})
</script>

<template>
  <div class="user_banner_box">
    <img class="user_banner" :src="userBanner" alt="user_banner_bg"/>
    <img class="avatar" :src="avatar" alt="avatar"/>
    <div class="nickname">{{nickname}}</div>
  </div>
</template>

<style scoped lang="sass">
.user_banner_box
  position: relative
  width: 100%
  height: 300px
  overflow: hidden
  box-shadow: #57505d50 0 1px 10px
  .user_banner
    width: 100%
    position: absolute
    top: 50%
    transform: translateY(-30%)
    opacity: .5
    z-index: -1
  .avatar
    $avatar-size: 128px
    width: $avatar-size
    height: $avatar-size
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    border-radius: 50%
  .nickname
    text-align: center
    font-size: 18px
    font-weight: bold
    margin-top: 220px
    color: white
    text-shadow: #57505d 0 0 5px
</style>