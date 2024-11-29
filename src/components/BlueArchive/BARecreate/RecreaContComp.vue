<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from "vue";
import {httpSpring} from "@/utils/http";
import {Close, CloseBold} from "@element-plus/icons-vue";
import {useBARecreateSgthemeStore} from "@/stores/BlueArchive/Recreate/RecreaSgthemeStore";
import RecreaSgthemeDetailComp from "@/components/BlueArchive/BARecreate/RecreaSgthemeDetailComp.vue";
import type {ThemeBriefImpl, ThemeClassifyBriefImpl} from "@/interfaces/ThemeImpl";
import {showExceptionNotice} from "@/utils/MsgNotific";
const baRecreateDetailStore = useBARecreateSgthemeStore();

// interface itemImpl {
//   title: string | null;
//   imgUrl?: any | null;
//   routerUrl?: string | null;
// }
interface secMenuItemImpl {
  title?: string | null;
  routerUrl?: string | null;
  theme_id?: string; // 假设这是从后端获取的额外属性
  header_image?: string; // 同样，假设这是从后端获取的额外属性
}

const itemList = ref<Array<ThemeClassifyBriefImpl> | null>(null);
const secMenuItemProp = ref<secMenuItemImpl>({title: null, routerUrl: null,});
const secMenuItemList = ref<Array<ThemeBriefImpl> | null>(null);
const isDetailShow = ref<boolean>(false);
const menuItemLevel = ref<number>(0);
const isFirstMount = ref<boolean>(true);

const returnMenuClicked = () => {
  menuItemLevel.value = 0;
}

const menuItemClicked = (routerName: string | null, classifyId: string) => {
  isFirstMount.value = false;
  switch (routerName) {
    case 'sgtheme': {
      menuItemLevel.value = 1;
      secMenuItemProp.value.routerUrl = routerName;
      fetchSgthemeItem(classifyId);
      break;
    } default: break;
  }
}

const fetchSgthemeItem = (classifyId: string) => {
  httpSpring({
    url: 'api/ba/theme/recreate',
    method: 'GET',
    headers: {Accept: '*/*'},
    params: {classify_id: classifyId}
  }).then(res => {
    if (res.status === 200 && res.data?.code === 0) {
      secMenuItemList.value = res.data?.data;
    }
  }).catch(err => {
    console.error(err);
  })
}
const sgthemeSecItemClicked = (themeId: string) => {
  console.log(true, 'sgtheme', themeId);
  baRecreateDetailStore.changeDetailsShow(true, 'sgtheme', themeId);
}
function beforeEnter(el: any) {
  el.style.opacity = 0;
  el.style.left = '60%';
}
function enter(el: any, done: any) {
  // 这里我们使用nextTick来确保DOM更新完成后再进行动画
  nextTick(() => {
    el.offsetWidth; // 触发重排
    el.style.transition = 'opacity 0.5s, left 0.5s';
    el.style.opacity = 1;
    el.style.left = '50%';
    done();
  });
}

function beforeLeave(el: any) {
  el.style.transition = 'opacity 0.5s, left 0.5s';
  el.style.opacity = 0;
  el.style.left = '60%';
}
onMounted(() => {
  httpSpring({
    url: 'api/ba/classify/all_brief_recreate',
    method: 'GET'
  }).then(res => {
    if (res?.data?.code === 0){
      itemList.value = res?.data?.data;
    }
  }).catch(err => {
    console.error(err);
    showExceptionNotice();
  })
})
watch(() => baRecreateDetailStore.isDetailShow, (newVal: boolean) => {
  isDetailShow.value = newVal;
})
</script>

<template>
  <Transition @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave">
    <RecreaSgthemeDetailComp v-if="isDetailShow && secMenuItemProp.routerUrl === 'sgtheme'"/>
  </Transition>
  <div class="in_container">
    <el-icon @click="returnMenuClicked" v-if="menuItemLevel !== 0" class="return_menu_button" size="64" :color="'#1289f8'"><CloseBold/></el-icon>
    <div :class="isFirstMount? 'menu_item_box': 'menu_item_box_nf'" v-if="menuItemLevel === 0 && itemList">
      <div class="item" v-for="(item, index) in itemList" :key="index" @click="menuItemClicked(item?.router_name || '', item.classify_id)">
        <img :src="item?.cover_image || ''" alt="img" />
      </div>
    </div>
    <div v-else></div>
    <div class="sec_menu_item_box" v-if="menuItemLevel === 1 && secMenuItemProp.routerUrl === 'sgtheme' && secMenuItemList">
      <div class="item" v-for="(item, index) in secMenuItemList" :key="index" @click="sgthemeSecItemClicked(item.theme_id)">
        <img :src="item.header_image" alt="img" />
      </div>
    </div>
    <div v-else></div>
  </div>
</template>

<style scoped lang="sass">
@keyframes item_box_in
  0%
    opacity: 0
    left: 45%
  100%
    opacity: 1
    left: 50%
@mixin item_box_in_ani()
  animation: item_box_in .5s 1.6s ease forwards
@mixin sec_item_box_in_ani()
  animation: item_box_in .5s ease forwards
.in_container
  position: absolute
  width: 65%
  height: 50%
  top: 55%
  left: 50%
  transform: translate(-50%, -50%)
  .return_menu_button
    position: absolute
    top: -10%
    left: -10%
    transition: .3s ease
  .return_menu_button:hover
    transform: rotate(45deg)
  .sec_menu_item_box, .menu_item_box_nf
    @include sec_item_box_in_ani()
  .menu_item_box
    @include item_box_in_ani()
  .menu_item_box, .sec_menu_item_box, .menu_item_box_nf
    width: 100%
    height: 100%
    position: absolute
    opacity: 0
    top: 50%
    left: 45%
    transform: translate(-50%, -50%)
    display: flex
    gap: 30px
    .item:hover
      transform: skew(-10deg) translateY(-5%)
      cursor: pointer
    .item
      width: 250px
      height: 130px
      transform: skew(-10deg)
      overflow: hidden
      position: relative
      border-radius: 10px
      border: white 5px solid
      box-shadow: #57505d50 5px 5px
      transform-origin: center
      transition: .3s ease
      img
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%, -50%) skew(10deg)
        width: 110%
        height: 110%
</style>