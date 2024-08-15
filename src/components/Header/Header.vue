<script setup lang="ts">
import {ChatDotSquare, Message, Service, Setting, UserFilled } from "@element-plus/icons-vue";
import {reactive, onMounted, onBeforeUnmount, ref} from 'vue';
import originAvatar from '@/assets/avatar.jpg'
import {http} from "@/utils/http";


const avatar = ref(originAvatar);

/* 全部用来处理Header组件滚动时样式 */
let headerClass = reactive({
  header: {
    'web_header': true,
    'web_header_transform_before': false,
    'web_header_transform_after': false,
  },
  icon: {
    color: ''
  }
})
const headerState = (state: number): void => {
  switch (state){
    case 0: {
      headerClass.header.web_header_transform_before = true;
      headerClass.header.web_header_transform_after = false;
      headerClass.icon.color = '#8CCCE2';
      break;
    }
    case 1: {
      headerClass.header.web_header_transform_before = false;
      headerClass.header.web_header_transform_after = true;
      headerClass.icon.color = '#FFF';
      break;
    }
    default: {
      headerClass.header.web_header_transform_before = true;
      headerClass.header.web_header_transform_after = false;
      headerClass.icon.color = '#8CCCE2';
      break;
    }
  }
}
const handleScroll = (): void => {
  if (window.scrollY === 0){
    headerState(0);
  } else{
    headerState(1);
  }
}


/* 全部用来执行用户登录状态的逻辑 */
let token = ref(window.localStorage.getItem('token'));
let isToken = ref(token.value != null);


onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  headerState(0);
  console.log('Header加载');
  token.value = localStorage.getItem('token');
  if (token.value){
    http({
      url: 'users/archive/avatar',
      method: 'GET',
      headers: {
        "Authorization": token.value
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 0){
        avatar.value = res.data.data;
      }
    }).catch(err => {
      console.error(err);
    })
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
<header :class="headerClass.header">
  <img class="header_logo" src="@/assets/miaoyulogo.png" alt="miaoyulogo"/>
  <ul v-if="isToken == false" class="header_user_box">
    <li style="margin-right: 50%">
      <a class="header_avatar_link" href="/sign">
        <el-icon class="header_icon" size="30" :color="headerClass.icon.color"><UserFilled /></el-icon>
      </a>
    </li>
  </ul>

  <ul v-if="isToken == true" class="header_user_box">
    <li style="margin-right: 50%">
      <a class="header_avatar_link" href="#">
        <img style="border-radius: 50%; height: 40px; width: 40px" :src="avatar" alt="avatar">
      </a>
    </li>
    <li>
      <a href="#">
        <el-icon class="header_icon" size="30" :color="headerClass.icon.color"><Message /></el-icon>
      </a>
    </li>
    <li>
      <a href="#">
        <el-icon class="header_icon" size="30" :color="headerClass.icon.color"><ChatDotSquare /></el-icon>
      </a>
    </li>
    <li>
      <a href="#">
        <el-icon class="header_icon" size="30" :color="headerClass.icon.color"><Service /></el-icon>
      </a>
    </li>
    <li>
      <a href="#">
        <el-icon class="header_icon" size="30" :color="headerClass.icon.color"><Setting /></el-icon>
      </a>
    </li>
  </ul>
<!--  <el-button :icon="Message" circle plain color="#8CCCE2FF" size="large"/>-->
</header>
</template>

<style scoped lang="sass">
.web_header_transform_before
  top: 20px
  left: 50%
  transform: translate(-50%)
  border-radius: 30px
  width: 80%
  background: #f0d4eb80
.web_header_transform_after
  top: 0
  left: 0
  transform: translate(0)
  width: 100%
  background: #33354c
  z-index: 1
.web_header
  display: flex
  align-items: center
  position: fixed
  height: 60px
  //background: linear-gradient(45deg, #f0d4eb80, #dff0f880)
  transition: .8s
  .header_user_box::after
    content: ""
    clear: both
  .header_user_box
    margin: 2px auto 0 2%
    padding: 0
    display: flex
    align-items: center
    li
      list-style: none
      float: left
      margin-right: 20%
      a
        text-decoration: none
        .header_icon
          transition: .8s
  .header_avatar_link
    height: 40px
  .header_logo
    position: absolute
    height: 40px
    right: 3%
</style>