<script setup lang="ts">
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
const userDetailStore = useUserDetailStore();
import PerCHeaderComp from "@/components/PersonalCenter/PerCHeaderComp.vue";
import {onMounted, ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
import {MapLocation, MessageBox, PriceTag} from "@element-plus/icons-vue";

import NaigosItem from "@/assets/Main/naigos_item.jpg";

interface ActivateServiceImpl {
  title: string;
  routerName: string;
  imgUrl?: string | null;
}

const activateServiceList = ref<ActivateServiceImpl[]>([
  {title: '奶果Naigos', routerName: 'Naigos', imgUrl: NaigosItem},
]);

const userArchive = ref<UserArchiveImpl>({...userDetailStore.userDetails});
const uploadExhibitionList = ref<any[]>([]);

onMounted(() => {
});
watch(() => userDetailStore.userDetails, (newVal: UserArchiveImpl) => {
  userArchive.value = newVal;
});
</script>

<template>
  <PerCHeaderComp/>
  <div class="left_right_box">
    <div class="left_box">
      <img class="avatar" :src="userArchive.avatar" alt="avatar"/>
      <div class="nickname">{{userArchive.nickname}}</div>
      <div class="uid">#{{userArchive.id}}</div>
      <div class="qq_id">QQ：{{userArchive.qq_id}}</div>
      <hr/>
      <ul>
        <li>
          <span><el-icon><MapLocation /></el-icon>：{{userArchive.city}}</span>
        </li>
        <li>
          <span><el-icon><MessageBox /></el-icon>：{{userArchive.email}}</span>
        </li>
        <li>
          <span><el-icon><PriceTag /></el-icon>：{{'开发者'}}</span>
        </li>
      </ul>
      <button class="edit_archive">修改资料</button>
    </div>
    <div class="right_box">
      <div class="module upload_exhibition_box">
        <h4>代表内容（作品收录、学习笔记…等）</h4>
        <hr/>
        <div class="upload_exhibition_item" v-if="uploadExhibitionList.length !== 0"></div>
        <div class="upload_exhibition_item_no" v-else>当前版栏无内容</div>
      </div>
      <div class="module activate_service_box">
        <h4>服务范围</h4>
        <hr/>
        <div class="activate_service_item" v-for="(item, index) in activateServiceList" :key="index">
          <img v-if="item.imgUrl" :src="item.imgUrl" alt="item"/>
          <div v-else>{{item.title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.left_right_box
  margin-top: 50px
  display: flex
  .left_box
    margin-left: 10%
    width: 260px
    .edit_archive
      color: #666
      letter-spacing: 1px
      font-family: BAFJ_CU, sans-serif
      font-weight: bold
      font-size: 16px
      width: 100%
      height: 38px
      border: #b4bccf 1px solid
      border-radius: 5px
      background-color: #f6f6f6
      transition: .2s ease
    .edit_archive:hover
      background-color: #e4e4e4
      cursor: pointer
    .avatar
      width: 100%
      border: #f0d4eb 2px solid
      border-radius: 50%
      margin-bottom: 1rem
    .nickname
      font-size: 24px
      font-family: sans-serif
      font-weight: bold
    .uid
      font-size: 16px
      color: #666
      font-weight: bold
    .qq_id
      margin-top: 10px
      font-size: 14px
    hr
      margin: 1.6rem auto
      border: #c3c3c3 1px solid
    ul
      padding: 0
      margin: 0
      li
        margin-bottom: 10px
        list-style: none
  .right_box
    flex: 1
    margin: 0 10% 0 2%
    .module::after
      content: ""
      display: block
      clear: both
    .module
      width: 100%
      max-height: 350px
      overflow: auto
      //border: 1px solid #f0d4eb
      margin-bottom: 20px
      h4
        margin: 0
        color: #666
      hr
        margin: .6rem auto
        border: #f0d4eb .1px solid
      .upload_exhibition_item_no
        text-align: center
        color: #666
        letter-spacing: 1px
        height: 50px
      .activate_service_item
        margin-right: 20px
        float: left
        width: 180px
        height: 90px
        overflow: hidden
        border-radius: 10px
        img
          width: 100%
        div
          height: 100%
          border: #f0d4eb 1px solid
</style>