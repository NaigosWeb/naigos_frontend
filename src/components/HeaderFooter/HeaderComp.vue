<script setup lang="ts">
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
const userDetailStore = useUserDetailStore();
import originAvatar from "@/assets/Main/avatar.jpg";
import {useRouter} from "vue-router";
import {Moon} from "@element-plus/icons-vue";
import {onMounted, ref, watch} from "vue";
const router = useRouter();

const avatarUrl = ref<string | null>(null);

const signClicked = () => {
  router.push("/sign");
}
onMounted(() => {
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

    <img @click="signClicked" class="avatar" :src="avatarUrl? avatarUrl: originAvatar" alt="avatar"/>
    <el-icon class="day_and_night">
      <Moon/>
    </el-icon>
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