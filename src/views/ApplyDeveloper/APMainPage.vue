<script setup lang="ts">

import TopHeader from "@/components/Header/TopHeader.vue";
import {ref} from "vue";
import router from "@/router";

const focusedIndex = ref(0)
const buttons = [
  {title: '详情了解'},
  {title: '看看契约'},
  {title: '填写资料'}
]

function focusButton(index: number) {
  focusedIndex.value = index; // 更新聚焦的按钮索引
  switch (index){
    case 0: {
      router.replace('/apply_developer/details');break;
    } case 1: {
      router.replace('/apply_developer/contract');break;
    } case 2: {
      router.replace('/apply_developer/form');break;
    }
  }
}
</script>

<template>
  <TopHeader/>
  <div class="banner_box">
    <img src="@/assets/ApplyDeveloper/banner.jpg" alt="banner"/>
  </div>
  <div class="select_router">
    <button
        v-for="(button, index) in buttons"
        :key="index"
        :class="{'is_focused': focusedIndex === index, 'not_focused': focusedIndex !== index}"
        @click="focusButton(index)">
      {{ button.title }}
    </button>
  </div>
  <router-view/>
</template>

<style scoped lang="sass">
.banner_box
  width: 100%
  height: 500px
  overflow: hidden
  box-shadow: #646a8020 0 10px 10px
.select_router
  margin: 20px auto 0 auto
  width: 1000px
  display: flex
  .is_focused
    color: white
    border: #646a80 1px solid
    background-color: #646a80
  .not_focused
    color: #646a80
    border: #646a80 1px solid
    background-color: #646a8000
  .is_focused, .not_focused
    flex: 1
    margin-right: 20px
    font-size: 16px
    letter-spacing: 2px
    border-radius: 5px
    padding: 8px 50px
    transition: .3s ease
  .is_focused:last-child, .not_focused:last-child
    margin: 0
  .is_focused:hover
    background-color: #8991af
    border: #8991af 1px solid
  .not_focused:hover
    color: white
    background-color: #646a80
  .is_focused:hover, .not_focused:hover
    cursor: pointer
</style>