<script setup lang="ts">
import {useBARecreateSgthemeStore} from "@/stores/BlueArchive/Recreate/RecreaSgthemeStore";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {httpSpring} from "@/utils/http";
import {Close} from "@element-plus/icons-vue";
const baRecreateSgthemeStore = useBARecreateSgthemeStore();
import BATBBgBase from "@/components/BlueArchive/BATBBgBase";
import type {ThemeImpl} from "@/interfaces/ThemeImpl";

// interface SgthemeImpl {
//   name: string;
//   url: string;
//   introduce: string;
//   header_image: string;
//   details_image: string;
//   cost: number;
//   eject_image: string;
//   theme_id: string;
// }

const themeId = ref<string>(baRecreateSgthemeStore.themeId);
const themeDetail = ref<ThemeImpl | null>(null);
const componentStyle = ref<any>({});

const fetchThemeDetail = () => {
  httpSpring({
    url: 'api/theme/only',
    method: 'GET',
    headers: {Accept: '*/*'},
    params: {theme_id: themeId.value},
  }).then(res => {
    if (res.status === 200 && res.data?.code === 0) {
      themeDetail.value = res.data?.data;
    }
  }).catch(err => {
    console.error(err);
  })
}

const closeClicked = () => {
  baRecreateSgthemeStore.changeDetailsShow(false, '', '');
}
const dowloadClicked = () => {
  window.location.href = themeDetail.value.url;
}

onMounted(() => {
  fetchThemeDetail();
})
watch(() => baRecreateSgthemeStore.themeId, (newVal: string) => {
  themeId.value = newVal;
  fetchThemeDetail();
})
watch(() => baRecreateSgthemeStore.isDetailShow, fetchThemeDetail);
</script>

<template>
  <div class="container_cover" :style="componentStyle">
    <img class="bg" src="@/assets/BlueArchive/Recreate/background.svg" alt="bg"/>
    <header class="cover_header">
      <el-icon @click="closeClicked" class="close_button" size="64" color="#1289f8"><Close/></el-icon>
      <h2>详情信息 / Sogou Input Theme</h2>
    </header>
    <div class="detail_container" v-if="themeDetail">
      <h3 class="detail_title">{{themeDetail?.name}}</h3>
      <div class="detail_introduce"><p>{{themeDetail?.introduce}}</p></div>
      <div class="download_button"><button @click="dowloadClicked" class="button" :style="{backgroundImage: `url(${BATBBgBase})`}">開始下載</button></div>
      <img class="detail_img" :src="themeDetail?.details_image || ''" alt="img"/>
    </div>
    <div v-else></div>
  </div>
</template>

<style scoped lang="sass">
.container_cover
  width: 100%
  height: 100%
  position: fixed
  top: 50%
  transform: translate(-50%, -50%)
  background-color: rgba(255, 255, 255, 0.2)
  backdrop-filter: blur(5px)
  z-index: 29
  text-align: center
  .detail_container
    width: 100%
    height: calc(100% - 70px)
    overflow: auto
    .detail_title
      font-weight: normal
      text-align: center
      font-family: 'BAFJ_CU', sans-serif
      letter-spacing: 1px
      font-size: 22px
      color: #666
    .detail_introduce
      text-align: center
      font-family: 'BAFJ_CU', sans-serif
      font-size: 18px
      color: #666
    .detail_img
      min-width: 60%
    .download_button
      width: 100%
      text-align: center
      .button:hover
        background-color: #ffffff
        cursor: pointer
      .button
        font-family: 'BAFJ_CU', sans-serif
        color: #3b3740
        font-size: 16px
        letter-spacing: 1px
        border-radius: 5px
        box-shadow: #57505d 0 0 5px
        width: 220px
        height: 40px
        border: none
        background: no-repeat left top #eff2f4
        transition: background-color .3s ease
  .cover_header
    width: 100%
    height: 70px
    display: flex
    align-items: center
    h2
      color: #1289f8
      font-family: 'BAFJ_CU', sans-serif
      font-weight: normal
      margin-left: 20px
      margin-top: 1.3%
    .close_button
      transition: .3s ease
    .close_button:hover
      transform: rotate(45deg)
      cursor: pointer
  .bg
    position: fixed
    right: 0
    bottom: 0
    height: 100%
    opacity: .5
    z-index: -1
</style>