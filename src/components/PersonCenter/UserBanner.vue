<script setup lang="ts">
import originUserBanner from '@/assets/PersonCenter/banner_bg.jpg';
import originAvatar from '@/assets/avatar.jpg';
import { usePersonStore } from '@/stores/PersonCenter';
import { ref, watch } from "vue";
import {http} from "@/utils/http";
const store = usePersonStore();

const userBanner = ref(originUserBanner);
const avatar = ref(originAvatar),
    nickname = ref('');

watch(() => store.data, (newData) => {
  if (newData){
    avatar.value = newData['avatar'];
    nickname.value = newData['nickname'];
  }
})

const buttons = [
  {title: '档案迁移'}
]
function focusButton(index: number) {
  switch (index){
    case 0: {
      changeArchiveClicked();break;
    } default: break;
  }
}

function changeArchiveClicked() {
  http({
    url: 'users/archive/change_archive',
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  }).then(res => {
    if (res.data.code === 0){
      window.location.reload();
    } else {
      alert(res.data.message);
    }
  }).catch(err => {
    console.error(err);
  })
}
</script>

<template>
  <div class="user_banner_box">
    <img class="user_banner" :src="userBanner" alt="user_banner_bg"/>
    <img class="avatar" :src="avatar" alt="avatar"/>
    <div class="nickname">{{nickname}}</div>
    <div class="banner_function_button_box">
      <button class="banner_function_button"
              v-for="(item, index) in buttons"
              :key="index"
              @click="focusButton(index)">
        {{item.title}}
      </button>
    </div>
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
  .banner_function_button_box
    width: 500px
    margin: 0 auto
    position: relative
    .banner_function_button:hover
      cursor: pointer
      background-color: #57505d
      color: white
    .banner_function_button
      width: 100px
      height: 35px
      font-size: 15px
      border-radius: 5px
      border: 1px #57505d solid
      background-color: #ffffff00
      font-weight: bold
      letter-spacing: 1px
      color: #57505d
      position: absolute
      margin-top: 10px
      left: 50%
      transform: translateX(-50%)
      transition: .3s ease
</style>