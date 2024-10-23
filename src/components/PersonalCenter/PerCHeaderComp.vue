<script setup lang="ts">
import {ref, watch, h} from "vue";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
import {httpSpring} from "@/utils/http";
const userDetailStore = useUserDetailStore();
import { ElMessage } from 'element-plus'
const checkinMessage = (text: string) => {
  ElMessage({
    message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
      h('span', { style: 'color: teal' }, text)
    ]),
  })
}

const userArchive = ref<UserArchiveImpl>(userDetailStore.userDetails);
const itemList: string[] = ['签到', '旧档案迁移'];

const itemClicked = (index: number) => {
  switch (index) {
    case 0: webCheckin(); break;
    case 1: webTransArchive(); break;
    default: break;
  }
}

function webCheckin() {
  httpSpring({
    url: 'users/checkin/web',
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: window.localStorage.getItem('token'),
    }
  }).then(res => {
    if (res?.data?.code === 0) checkinMessage(res?.data?.data);
    else checkinMessage(res?.data?.message);
  }).catch(() => {checkinMessage('未知失败！');});
}
function webTransArchive() {
  httpSpring({
    url: 'users/trans_archive/web',
    method: 'GET',
    headers: {'Content-Type': 'application/x-www-form-urlencoded', Authorization: window.localStorage.getItem('token')},
  }).then(res => {
    if (res?.data?.code === 0) checkinMessage(res?.data?.data + '请刷新网页！');
    else checkinMessage(res?.data?.message);
  }).catch(() => {checkinMessage('未知失败！');});
}

watch(() => userDetailStore.userDetails, (newVal: UserArchiveImpl) => {
  userArchive.value = newVal;
})
</script>

<template>
  <header class="header">
    <div class="archive_brief_detail">布丁：{{userArchive.score}}</div>
    <div class="archive_brief_detail">好感度：{{userArchive.favorite}}</div>
    <div class="archive_brief_detail">账号风险：{{
        7 <= userArchive.safe_level?
            '安全': 5 <= userArchive.safe_level?
                '中等': 3 <= userArchive.safe_level?
                    '危险': '高度危险！'}}</div>
    <div class="item_box">
      <div class="item" v-for="(item, index) in itemList" :key="index" @click="itemClicked(index)">{{item}}</div>
    </div>
  </header>
</template>

<style scoped lang="sass">
.header
  width: 100%
  height: 60px
  background-color: #57505d
  display: flex
  align-items: center
  .archive_brief_detail
    margin-left: 20px
    color: white
  .item_box
    display: flex
    margin: 0 4% 0 auto
    .item
      border-radius: 5px
      display: flex
      align-items: center
      justify-content: center
      height: 30px
      width: 100px
      border: white 1px solid
      color: white
      background-color: #ffffff50
      margin-right: 20px
      transition: .3s ease
    .item:last-child
      margin-right: 0
    .item:hover
      cursor: pointer
      background-color: #ffffff70
</style>