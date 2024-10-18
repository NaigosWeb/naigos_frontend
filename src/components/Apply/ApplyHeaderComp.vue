<script setup lang="ts">
interface itemImpl {
  title: string;
  url: string;
}
const itemList: itemImpl[] = [
  {title: '加入开发', url: 'apply_dev'},
  {title: '学习开发', url: 'stu_dev'},
  {title: '提送成果', url: 'upload_record'},
]
</script>

<template>
  <header class=header>
    <div class="item_box">
      <div v-for="(item, index) in itemList" :key="index" class="item">
        {{item.title}}
      </div>
    </div>
    <img class="header_bg" src="@/assets/Apply/button_title_bg.svg" alt="bg"/>
    <img class="avatar" src="@/assets/Main/avatar.jpg" alt="avatar" />
    <p class="welcome_title">欢迎您！开发者：Yasenbaka</p>
  </header>
</template>

<style scoped lang="sass">
@keyframes header_in
  0%
    opacity: 0
    transform: translateY(-10px)
  100%
    opacity: .8
    transform: translateY(0)
@mixin header_in_ani()
  animation: header_in .8s ease
.header:hover
  background-color: #57505d
.header
  @include header_in_ani()
  transition: background-color .3s ease
  border-radius: 0 0 50px 50px
  margin: 0 auto
  min-width: 1500px
  max-width: 1500px
  height: 80px
  background-color: #57505d98
  display: flex
  align-items: center
  position: relative
  overflow: hidden
  .item_box
    margin-left: 2%
    margin-right: auto
    height: 45%
    display: flex
    gap: 20px
    z-index: 1
    .item:hover
      background-color: #ffffff80
      cursor: pointer
    .item
      transition: .3s ease
      border-radius: 5px
      display: flex
      align-items: center
      justify-content: center
      padding: 10px
      color: white
      background-color: #ffffff50
      border: white 1px solid
  .header_bg
    opacity: .6
    position: absolute
    top: 50%
    left: 0
    transform: translate(0, -50%)
  .welcome_title
    color: white
    margin-right: 2%
    margin-left: auto
    font-size: 20px
    font-family: BAFJ_CU, sans-serif
  .avatar
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    width: 48px
    height: 48px
    border-radius: 50%
</style>