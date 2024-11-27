<script setup lang="ts">
import {onMounted, ref} from "vue";
import {httpSpring} from "@/utils/http";
import type {ThemeBriefImpl, ThemeClassifyImpl} from "@/interfaces/ThemeImpl";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";
import {useRoute, useRouter} from "vue-router";
const route = useRoute();
const router = useRouter();

const themeBriefList = ref<ThemeBriefImpl[] | null>(null);
const themeClassifyDetail = ref<ThemeClassifyImpl | null>(null);

onMounted(() => {
  httpSpring({
    url: 'api/theme/classify/eligible',
    method: 'GET',
    params: {classify_id: route.params.classify_id as string | null}
  }).then(res => {
    if (res?.data?.code === 0) {
      themeClassifyDetail.value = res.data?.data;
    } else showMessageNotice('red', res?.data?.message);
  }).catch(err => {
    console.error(err);
    showMessageNotice('red', '未知异常！');
  })
  httpSpring({
    url: 'api/theme/all_eligible_brief',
    method: 'GET',
    params: {classify_id: route.params.classify_id as string | null}
  }).then(res => {
    if (res?.data?.code === 0) {
      themeBriefList.value = res?.data?.data;
      console.log(themeBriefList.value);
    } else {
      showMessageNotice('red', res?.data?.message);
    }
  }).catch(err => {
    console.error(err);
    showExceptionNotice();
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
    <RouterView/>
  </div>
</template>

<style scoped lang="sass">
.eligible_container
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