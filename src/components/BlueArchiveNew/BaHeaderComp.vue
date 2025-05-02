<script setup lang="ts">
import baLogo from "@/assets/BlueArchive/logo_2.e1693a80.png"
import {HomeFilled, UserFilled, StarFilled} from "@element-plus/icons-vue";

const headerItems = [
  {
    icon: HomeFilled,
    text: '主页'
  },
  {
    icon: StarFilled,
    text: '美化'
  },
  {
    icon: UserFilled,
    text: '模型'
  },
  {
    icon: UserFilled,
    text: '模型'
  }

]
</script>

<template>
  <header class="ba_header">
    <img class="ba_logo" :src="baLogo" alt="logo"/>
    <div class="ba_header_items">
      <div
          class="header_item"
          v-for="(item, index) in headerItems"
          :key="index"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <p>{{ item.text }}</p>
      </div>
    </div>
  </header>
</template>

<style scoped lang="css">
.ba_header {
  width: 100%;
  height: 4rem;
  background: linear-gradient(rgb(230, 243, 251) 0%, rgba(0, 0, 0, 0) 80%);
  display: flex;
  align-items: center;
  .ba_logo {
    height: 100%;
    padding: 0 1rem;
  }
  .ba_header_items {
    display: flex;
    align-items: center;
    .header_item {
      display: flex;
      align-items: center;
      font-size: 1.2rem;
    }
  }
}
</style>