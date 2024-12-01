<script setup lang="ts">
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import {onMounted, ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
const userDetailStore = useUserDetailStore();

const userArchive = ref<UserArchiveImpl | null>(null);

onMounted(() => {
  userArchive.value = userDetailStore.userDetails as UserArchiveImpl;
})

watch(() => userDetailStore.userDetails, (newVal: UserArchiveImpl) => {
  userArchive.value = newVal;
})
</script>

<template>
  <div class="upload_box">
    <h4>上传您的作品</h4>
    <el-form label-width="auto" class="form_box">
      <el-form-item label="作品名：">
        <el-input/>
      </el-form-item>
      <el-form-item label="作品介绍：">
        <el-input type="textarea"/>
      </el-form-item>
      <el-form-item label="作品封面图：">

      </el-form-item>
      <el-form-item label="作品详情图：">
      </el-form-item>
      <el-form-item label="下载链接：">
        <el-input/>
      </el-form-item>
      <el-form-item label="上传者：" v-if="userArchive">
        {{`${userArchive.nickname} #${userArchive.id}`}}
      </el-form-item>
      <el-form-item>
        <el-button type="primary">上传</el-button>
        <el-button type="danger">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="sass">
.upload_box
  flex: 1
  border: #f0d4eb 1px solid
  border-radius: 10px
  padding: 20px
  max-height: calc(100vh - 500px)
  overflow: auto
  h4
    margin-top: 0
    text-align: center
</style>