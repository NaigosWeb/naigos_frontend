<script setup lang="ts">
import {nextTick, onBeforeUnmount, onMounted, ref} from "vue";
import {bgvChange, tfsChange} from "@/utils/BlueArchive/BaTfsBgvUtil";
import "./item.css";
import BaRcrTitleComp from "@/components/BlueArchive/BaContainers/ReCreation/BaRcrTitleComp.vue";
import {Close, Download} from "@element-plus/icons-vue";
import axios from 'axios';
import {httpSpring} from "@/utils/http";

const isDetailShow = ref(false);
const itemList = ref([]);
const itemDetail = ref({
  name: null,
  url: '#',
  introduce: null,
  header_image: '',
  details_image: '',
  cost: 0,
  eject_image: '',
  theme_id: '',
});
const componentStyle = ref({});

function itemClicked (themeId: number) {
  isDetailShow.value = true;
  httpSpring({
    url: `/api/sgtheme/only?theme_id=${themeId}`,
    method: 'GET',
    headers: {
      Accept: '*/*'
    }
  }).then(res => {
    if (res.data.code === 0) {
      if (res.data.data.details_image) {
        let detailsImageList = res.data.data.details_image.split('[;hr]');
        if (detailsImageList.length > 0) res.data.data.details_image = detailsImageList;
      }
      itemDetail.value = res.data.data;
    } else {
      console.error(res);
    }
  }).catch(err => {
    console.error(err);
  })
}
function closeDetailBox () {
  isDetailShow.value = false;
}

function beforeEnter(el: any) {
  el.style.opacity = 0;
  el.style.left = '60%';
}
function enter(el: any, done: any) {
  // 这里我们使用nextTick来确保DOM更新完成后再进行动画
  nextTick(() => {
    el.offsetWidth; // 触发重排
    el.style.transition = 'opacity 0.8s, left 0.8s';
    el.style.opacity = 1;
    el.style.left = '50%';
    done();
  });
}

function beforeLeave(el: Element) {
  // setTimeout(() => { done(); }, 500);
  (el as HTMLElement).style.transition = 'opacity 0.8s, left 0.8s';
  (el as HTMLElement).style.opacity = '0';
  (el as HTMLElement).style.left = '60%';
}

onMounted(() => {
  bgvChange(false);
  httpSpring({
    url: '/api/sgtheme/all_eligible_brief?classify_id=blue_archive',
    method: 'GET',
    headers: {
      Accept: '*/*'
    }
  }).then(res => {
    if (res.data.code === 0){
      itemList.value = res.data.data;
    } else {
      console.error(res);
    }
  }).catch(err => {
    console.error(err);
  })
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
        <div class="title">
          <h3>{{itemDetail.name}}</h3><hr/>
        </div>
        <div class="detail_container">
          <p class="introduce">{{itemDetail.introduce}}</p>
          <a :href="itemDetail.url">
          <el-icon><Download/></el-icon>
          点击下载
        </a>
          <div v-if="itemDetail.details_image" v-for="(item, index) in itemDetail.details_image" :key="index" class="details_image_box">
            <img :src="item.toString()" alt="pic"/>
          </div>
        </div>
      </div>
    </transition>
    <BaRcrTitleComp/>
    <div class="rc_card_box">
      <div class="rc_card_pic_item" v-for="(item,index) in itemList" :key="index" @click="itemClicked(item['theme_id'])">
        <img :src="item['header_image']" alt="pic"/>
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
    .title
      h3
        text-align: center
        color: #1289f8
        font-size: 22px
        margin: 0
      hr
        width: 95%
    .detail_container
      width: 90%
      margin: 0 auto
      .introduce
        font-size: 18px
      .details_image_box
        width: 480px
        margin: 0 auto
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