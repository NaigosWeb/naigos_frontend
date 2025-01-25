<script setup lang="ts">
import defaultAvatar from "@/assets/Main/avatar.jpg";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import {onMounted, ref, watch} from "vue";
const userDetailStore = useUserDetailStore();
import {useRouter} from "vue-router";
const router = useRouter();

const avatar = ref<string | null>(userDetailStore.userAvatar);
const itemList: Array<{title: string; router_name: string; web_url?: string | null}> = [
  {title: '管理作品', router_name: 'ThemeUDU', web_url: `https://udus.naigos.cn/replace?token=${window.localStorage.getItem("token")}&target=Work`},
]

const isSignin = (): boolean => !!window.localStorage.getItem("token");

const itemClicked = (routerName: string | null, webUrl: string | null) => {
  if (routerName === null && webUrl !== null) {
    window.location.href = webUrl;
  }
  if (routerName !== null){
    router.push({ name: routerName });
  }
}
watch(() => userDetailStore.userAvatar, newValue => {avatar.value = newValue;});
</script>

<template>
  <header class="header">
    <img class="header_bg" src="@/assets/Apply/button_title_bg.svg" alt="bg"/>
    <img class="avatar" :src="avatar || defaultAvatar" alt="avatar" @click="isSignin()? console.log('滴滴滴'): router.push({name: 'Sign'})"/>
    <div class="item_bar" v-if="isSignin()">
      <div class="item" v-for="(item, index) in itemList" :key="index"
           @click="item.web_url?
            itemClicked(null, item.web_url)
            :itemClicked(item.router_name, null)">
        {{item.title}}
      </div>
    </div>
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
  overflow: hidden
  .item_bar
    margin-left: 1%
    display: flex
    z-index: 1
    .item:hover
      background-color: #ffffff80
      cursor: pointer
    .item
      text-align: center
      line-height: 30px
      margin-right: 10px
      border-radius: 5px
      background-color: #ffffff50
      color: white
      padding: 0 16px
      height: 32px
      border: white 1px solid
      transition: .3s ease
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