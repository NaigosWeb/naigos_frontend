<script setup lang="ts">
import {nextTick, onBeforeUnmount, onMounted, ref} from "vue";
import {bgvChange, tfsChange} from "@/utils/BlueArchive/BaTfsBgvUtil";
import "./item.css";
import midoriMeido1 from "@/assets/BlueArchive/SogouInputTheme/midori_meido_1.png";
import momoiMeido1 from "@/assets/BlueArchive/SogouInputTheme/momoi_meido_1.jpg";
import BaRcrTitleComp from "@/components/BlueArchive/BaContainers/ReCreation/BaRcrTitleComp.vue";
import {Close} from "@element-plus/icons-vue";

const isDetailShow = ref(false);
const itemPicList = [
  midoriMeido1,
  momoiMeido1
]
const componentStyle = ref({});

function itemClicked (index: number) {
  isDetailShow.value = true;
}
function closeDetailBox () {
  isDetailShow.value = false;
}

function beforeEnter(el) {
  el.style.opacity = 0;
  el.style.left = '60%';
}
function enter(el, done) {
  // 这里我们使用nextTick来确保DOM更新完成后再进行动画
  nextTick(() => {
    el.offsetWidth; // 触发重排
    el.style.transition = 'opacity 0.8s, left 0.8s';
    el.style.opacity = 1;
    el.style.left = '50%';
    done();
  });
}

function beforeLeave(el, done) {
  setTimeout(() => { done(); }, 500);
  el.style.transition = 'opacity 0.8s, left 0.8s';
  el.style.opacity = 0;
  el.style.left = '60%';
}

onMounted(() => {
  bgvChange(false);
})
onBeforeUnmount(() => {
  tfsChange();
})
</script>

<template>
  <div class="container">
    <transition @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" name="fade-move">
      <div class="detail_box" v-if="isDetailShow" :style="componentStyle">
        <div class="detail_header">
          <h3>详情介绍</h3>
          <el-icon class="close_button" size="64" color="#666" @click="closeDetailBox"><Close/></el-icon>
        </div>
      </div>
    </transition>
    <BaRcrTitleComp/>
    <div class="rc_card_box">
      <div class="rc_card_pic_item" v-for="(item,index) in itemPicList" :key="index" @click="itemClicked(index)">
        <img :src="item" alt="pic"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">

.container
  .detail_box
    position: fixed
    border-radius: 30px
    background-color: #ffffff20
    backdrop-filter: blur(10px)
    min-width: 100%
    min-height: 100%
    max-height: 100%
    overflow: auto
    z-index: 1
    //left: 50%
    //opacity: 1
    top: 50%
    transform: translate(-50%, -50%)
    .detail_header
      position: relative
      width: 100%
      height: 6rem
      display: flex
      align-items: center
      .close_button:hover
        cursor: pointer
        transform: rotateZ(45deg)
      .close_button
        transition: .3s ease
        margin: 0 3% 0 auto
      h3
        margin: 0 auto 0 3%
        font-size: 1.5rem
    .a112a
      width: 50px
      height: 50px
      background-color: #f0d4eb
      margin-bottom: 20px

  .rc_card_box
    width: 60%
    margin: 5% auto
    .rc_card_pic_item:hover
      cursor: pointer
      transform: skewX(170deg) translateY(-5%)
    .rc_card_pic_item
      transition: .3s ease
      display: inline-block
      margin-right: 40px
      width: 300px
      height: 150px
      transform: skewX(170deg)
      overflow: hidden
      border: 5px solid white
      box-shadow: #00000030 5px 5px 0
      border-radius: .5rem
      img
        width: 110%
        border-radius: .5rem
        transform: skewX(-170deg)
</style>