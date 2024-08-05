<script setup lang="ts">
import {ChatDotSquare, Message, Service, Setting, UserFilled } from "@element-plus/icons-vue";
import {ref} from 'vue';

/* 全部用来执行用户登录状态的逻辑 */
let token = ref(window.localStorage.getItem('token'));
let isToken = ref(token.value != null);
</script>

<template>
  <header class="web_header">
    <img class="header_logo" src="@/assets/miaoyulogo.png" alt="miaoyulogo"/>
    <ul v-if="isToken == false" class="header_user_box">
      <li style="margin-right: 50%">
        <a class="header_avatar_link" href="/sign">
          <el-icon class="header_icon" size="30" color="#fff"><UserFilled /></el-icon>
        </a>
      </li>
    </ul>

    <ul v-if="isToken == true" class="header_user_box">
      <li style="margin-right: 50%">
        <a class="header_avatar_link" href="#">
          <img style="border-radius: 50%; height: 40px; width: 40px" src="@/assets/avatar.jpg" alt="avatar">
        </a>
      </li>
      <li>
        <a href="#">
          <el-icon class="header_icon" size="30" color="#fff"><Message /></el-icon>
        </a>
      </li>
      <li>
        <a href="#">
          <el-icon class="header_icon" size="30" color="#fff"><ChatDotSquare /></el-icon>
        </a>
      </li>
      <li>
        <a href="#">
          <el-icon class="header_icon" size="30" color="#fff"><Service /></el-icon>
        </a>
      </li>
      <li>
        <a href="#">
          <el-icon class="header_icon" size="30" color="#fff"><Setting /></el-icon>
        </a>
      </li>
    </ul>
  </header>
</template>

<style scoped lang="sass">
.web_header
  width: 100%
  background: #33354c
  height: 60px
  align-items: center
  display: flex
  z-index: 1
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