<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {ChatDotSquare, Message, Service, Setting} from "@element-plus/icons-vue";
const currentTime = ref(new Date().toLocaleTimeString());
function updateTime() {
  currentTime.value = new Date().toLocaleTimeString();
}
onMounted(() => {
  const timer = setInterval(updateTime, 1000);
  onBeforeUnmount(() => {
    clearInterval(timer);
  });
});

</script>

<template>
<header class="web_header">
  <p>{{currentTime}}</p>
  <img class="header_logo" src="@/assets/miaoyulogo.png" alt="miaoyulogo"/>
  <ul class="header_user_box">
    <li style="margin-right: 50%">
      <a class="header_avatar_link" href="#">
        <img style="border-radius: 50%; height: 40px; width: 40px" src="@/assets/avatar.jpg" alt="avatar">
      </a>
    </li>
    <li>
      <a href="#">
        <el-icon size="30" color="#8CCCE2FF"><Message /></el-icon>
      </a>
    </li>
    <li>
      <a href="#">
        <el-icon size="30" color="#8ccce2"><ChatDotSquare /></el-icon>
      </a>
    </li>
    <li>
      <a href="#">
        <el-icon size="30" color="#8ccce2"><Service /></el-icon>
      </a>
    </li>
    <li>
      <a href="#">
        <el-icon size="30" color="#8ccce2"><Setting /></el-icon>
      </a>
    </li>
  </ul>
<!--  <el-button :icon="Message" circle plain color="#8CCCE2FF" size="large"/>-->
</header>
</template>

<style scoped lang="sass">
.web_header
  display: flex
  align-items: center
  position: fixed
  top: 20px
  left: 50%
  transform: translate(-50%)
  border-radius: 30px
  width: 80%
  height: 60px
  background: linear-gradient(45deg, #f0d4eb80, #dff0f880)
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
  .header_avatar_link
    height: 40px
  .header_logo
    position: absolute
    height: 40px
    right: 3%
</style>