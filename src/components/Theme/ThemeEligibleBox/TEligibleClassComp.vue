<script setup lang="ts">
import {onMounted, ref} from "vue";
import {httpSpring} from "@/utils/http";
import type {ThemeBriefImpl, ThemeClassifyImpl} from "@/interfaces/ThemeImpl";
import {showMessageNotific} from "@/utils/MsgNotific";
import {useRoute, useRouter} from "vue-router";
const route = useRoute();
const router = useRouter();

const themeBriefList = ref<ThemeBriefImpl[] | null>(null);
const themeClassifyDetail = ref<ThemeClassifyImpl | null>(null);

onMounted(() => {
  const routerName = route.path.split("/").pop();
  httpSpring({
    url: 'api/theme/classify/eligible',
    method: 'GET',
    params: {classify_id: routerName}
  }).then(res => {
    if (res?.data?.code === 0) {
      themeClassifyDetail.value = res.data?.data;
    } else showMessageNotific('red', res?.data?.message);
  }).catch(err => {
    console.error(err);
    showMessageNotific('red', '未知异常！');
  })
  httpSpring({
    url: 'api/theme/all_eligible_brief',
    method: 'GET',
    params: {classify_id: routerName}
  }).then(res => {
    if (res?.data?.code === 0) {
      themeBriefList.value = res?.data?.data;
      console.log(themeBriefList.value);
    } else {
      showMessageNotific('red', res?.data?.message);
    }
  }).catch(err => {
    console.error(err);
    showMessageNotific('red', '未知异常！');
  })
})
</script>

<template>
  <div class="eligible_container">
    <div class="sub_title">
      <button class="return_button" @click="router.back()">返回</button>
      <h3>{{themeClassifyDetail?.zhsg_name || ''}}</h3>
      <span class="search_bar">
        <span>作品名搜索：</span>
        <input type="text" placeholder="请输入" required/>
        <button class="search_button">搜索</button>
      </span>
    </div>
    <div class="item_box" v-if="themeBriefList && themeBriefList.length > 0">
      <div class="item" v-for="(item, index) in themeBriefList" :key="index">
        <img class="cover_image" :src="item?.header_image || ''" alt="cover_img"/>
      </div>
    </div>
    <div class="item_box" v-else>无结果</div>
  </div>
</template>

<style scoped lang="sass">
.eligible_container
  .item_box
    padding: 50px
    display: flex
    .item:hover
      transform: skew(-10deg) translateY(-5%)
      cursor: pointer
    .item
      transform: skew(-10deg)
      border-radius: 10px
      border: white 5px solid
      box-shadow: #57505d50 5px 5px
      width: 250px
      height: 130px
      transform-origin: center
      transition: .3s ease
      position: relative
      overflow: hidden
      .cover_image
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%, -50%) skew(10deg)
        width: 110%
        height: 110%
  .sub_title
    height: 60px
    display: flex
    align-items: center
    box-shadow: #57505d50 0 3px 2px
    color: #57505d
    .search_bar
      margin: 0 20px
    .return_button
      height: 48px
      width: 48px
      margin: 0 20px
      background-color: #f0d4eb50
      border: #f0d4eb 1px solid
      border-radius: 5px
      color: #57505d
      transition: .3s ease
    .return_button:hover
      background-color: #f0d4eb80
      cursor: pointer
</style>