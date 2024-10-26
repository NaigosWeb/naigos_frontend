<script setup lang="ts">
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
const userDetailStore = useUserDetailStore();
import {MapLocation, MessageBox, PriceTag} from "@element-plus/icons-vue";
import {ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
import {useRouter} from "vue-router";
import type {UserPermiImpl} from "@/interfaces/UserPermiImpl";
const router = useRouter();

const userArchive = ref<UserArchiveImpl>({...userDetailStore.userDetails});
const userPermi = ref<UserPermiImpl>({...userDetailStore.userPermi});

const editArchiveClicked = () => {
  router.push({name: 'PersonalCenterEditArchive'});
}

watch(() => userDetailStore.userDetails, (newVal: UserArchiveImpl) => {
  userArchive.value = newVal;
});
watch(() => userDetailStore.userPermi, (newVal: UserPermiImpl) => {
  userPermi.value = newVal;
});
</script>

<template>
  <img class="avatar" :src="userArchive?.avatar || ''" alt="avatar"/>
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
      <span><el-icon><PriceTag /></el-icon>：{{userPermi.cn}}</span>
    </li>
  </ul>
  <button class="edit_archive" @click="editArchiveClicked">修改资料</button>
</template>

<style scoped lang="sass">
.edit_archive:hover
  background-color: #e4e4e4
  cursor: pointer
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
</style>