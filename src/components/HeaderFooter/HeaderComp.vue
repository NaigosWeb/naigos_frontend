<script setup lang="ts">
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
const userDetailStore = useUserDetailStore();
import originAvatar from "@/assets/Main/avatar.jpg";
import {useRouter} from "vue-router";
import {nextTick, onMounted, ref, watch} from "vue";
import {Avatar, CircleCloseFilled} from "@element-plus/icons-vue";
const router = useRouter();

const avatarUrl = ref<string | null>(null);
const isUserCardShow = ref<boolean>(false);
const isToken = ref<boolean>(!!window.localStorage.getItem('token'));

const userCardClicked = (index: number) => {
  if (window.localStorage.getItem('token')){
    switch (index){
      case 0: router.push({name: 'PersonalCenter'});break;
      case 1: {
        window.localStorage.removeItem('token');
        window.location.reload();
        break;
      } default: break;
    }
  } else router.push("/sign");
}
function beforeEnter(el: any) {
  el.style.opacity = 0;
  el.style.top = '5%';
}
function enter(el: any, done: any) {
  // 这里我们使用nextTick来确保DOM更新完成后再进行动画
  nextTick(() => {
    el.offsetWidth; // 触发重排
    el.style.transition = 'opacity 0.5s, top 0.5s';
    el.style.opacity = 1;
    el.style.top = '0%';
    done();
  });
}
function beforeLeave(el: any) {
  el.style.transition = 'opacity 0.5s, top 0.5s';
  el.style.opacity = 0;
  el.style.top = '5%';
}

onMounted(() => {
  if (!window.localStorage.getItem('token')){
    isToken.value = false;
  }
  avatarUrl.value = userDetailStore.userAvatar;
})
watch(() => userDetailStore.userAvatar, (newVal: string) => {
  avatarUrl.value = newVal;
})
</script>

<template>
  <header class="header">
    <div class="weather">
      <div>北京</div>
      <div>15℃ 阴</div>
    </div>
    <img class="logo" src="@/assets/Main/miaoyulogo.png" alt="miaoyulogo"/>
    <img @mouseover="isToken?isUserCardShow = true: isUserCardShow = false" @mouseleave="isUserCardShow = false" @click="userCardClicked(0)" class="avatar" :src="avatarUrl? avatarUrl: originAvatar" alt="avatar"/>

    <Transition @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave">
      <div @mouseover="isUserCardShow = true" @mouseleave="isUserCardShow = false" class="user_card" v-if="isUserCardShow">
        <div style="height: 60px; width: 100%; opacity: 0"></div>
        <ul>
          <li @click="userCardClicked(0)">
            <div><el-icon><Avatar /></el-icon>&nbsp;个人中心</div>
          </li>
          <li @click="userCardClicked(1)">
            <div><el-icon><CircleCloseFilled /></el-icon>&nbsp;退出登录</div>
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>

<style scoped lang="sass">
@keyframes header_in
  0%
    opacity: 0
    width: 70vw
  100%
    opacity: 1
    width: 90vw
@mixin header_in_ani()
  animation: header_in .8s ease
  animation-fill-mode: forwards
.header
  position: fixed
  width: 90vw
  height: 60px
  top: 30px
  left: 50%
  transform: translateX(-50%)
  transition: .5s ease
  background-color: #ffffff90
  box-shadow: #57505d50 0 0 5px
  border-radius: 30px
  z-index: 19
  display: flex
  align-items: center
  @include header_in_ani()
  .user_card
    width: 200px
    position: absolute
    right: -4%
    ul
      box-shadow: #57505d50 0 0 10px
      overflow: hidden
      border-radius: 5px
      background-color: white
      width: 100%
      margin: 0
      padding: 0
      li:hover
        background-color: #e6e6e6
        cursor: pointer
      li:last-child
        margin-bottom: 0
      li
        transition: .3s ease
        list-style: none
        div
          padding: 10px
          display: flex
          align-items: center
  .weather
    margin: 8px auto auto 1.5%
    height: 90%
    text-align: center
  .logo
    height: 50%
  .avatar
    margin: 0 .5% 0 auto
    width: 48px
    height: 48px
    border-radius: 50%
    cursor: pointer
//.header:hover
//  width: 100vw
//  top: 0
//  background-color: #ffffff
//  border-radius: 0
//  box-shadow: #57505d80 0 5px 10px
</style>