<script setup lang="ts">
import {ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import {httpSpring} from "@/utils/http";
import {showMessageNotific} from "@/utils/MsgNotific";
const userDetailStore = useUserDetailStore();
import {useRouter} from "vue-router";
const router = useRouter();

const userArchive = ref<UserArchiveImpl>({
  qq_id: userDetailStore.userDetails.qq_id,
  nickname: userDetailStore.userDetails.nickname,
  email: userDetailStore.userDetails.email,
  city: userDetailStore.userDetails.city,
})

const editClicked = () => {
  console.log(userArchive.value);
  httpSpring({
    url: 'users/edit_archive/web',
    method: 'PUT',
    headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
    data: userArchive.value,
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotific('teal', res?.data?.data);
      userDetailStore.fetchUserArchive();
      router.back();
    } else showMessageNotific('red', res?.data?.message);
  }).catch(() => {
    showMessageNotific('red', '请求异常！请检查网络！');
  })
}
const exitEditClicked = () => {
  router.back();
}

watch(() => userDetailStore.userDetails, (newVal: UserArchiveImpl) => {
  userArchive.value = {...newVal};
})
</script>

<template>
  <div class="edit_archive_box">
    <el-form label-width="auto" :model="userArchive" style="width: 800px;" @submit.prevent="editClicked">
      <el-form-item label="昵称：">
        <el-input type="text" v-model="userArchive.nickname"/>
      </el-form-item>
      <el-form-item label="电子邮箱：">
        <el-input type="text" v-model="userArchive.email"/>
      </el-form-item>
      <el-form-item label="QQ号：">
        <el-input title="一年只能修改一次" type="text" v-model="userArchive.qq_id"/>
        一年只能修改一次！
      </el-form-item>
      <el-form-item label="所在地：">
        <el-input type="text" v-model="userArchive.city"/>
        任意国、省、市、区县镇或外国、州、府、道、区，也可精确全写。
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认修改</el-button>
        <el-button type="warning" native-type="button" @click="exitEditClicked">取消修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="sass">
.edit_archive_box
  color: #666
</style>