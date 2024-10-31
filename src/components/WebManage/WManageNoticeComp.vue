<script setup lang="ts">
import "./Notice/WMNoticeTitleStyle.sass";
import "./Notice/WMNoticeAllNoticeStyle.sass";
import {onMounted, ref, watch} from "vue";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import type {NaigosNoticeImpl} from "@/interfaces/NaigosNoticeImpl";
import {httpSpring} from "@/utils/http";
import {timestampToTime} from "@/utils/TimestampToTime";
import {showMessageNotific} from "@/utils/MsgNotific";
const userDetailStore = useUserDetailStore();



const noticeList = ref<NaigosNoticeImpl[] | null>(null);

const uploadNoticeForm = ref<{title: string, content: string}>({
  title: '',
  content: '',
});

const fetchNotice = () => {
  httpSpring({
    url: 'api/notice/manage/all',
    method: "GET",
    headers: {Authorization: window.localStorage.getItem('token')}
  }).then(res => {
    if (res?.data?.code === 0){
      noticeList.value = res?.data?.data;
    }
  }).catch(err => {
    console.error(err);
  })
}

const deleteNoticeClicked = (noticeId: string) => {
  httpSpring({
    url: 'api/notice/delete',
    method: "DELETE",
    headers: {
      Authorization: window.localStorage.getItem('token'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {notice_id: noticeId}
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotific('green', res?.data?.data);
      fetchNotice();
    } else {
      showMessageNotific('red', res?.data?.message);
    }
  }).catch((err) => {
    showMessageNotific('red', '操作失败！');
    console.error(err);
  })
}

const uploadNoticeClicked = () => {
  httpSpring({
    url: 'api/notice/upload',
    method: "POST",
    headers: {
      Authorization: window.localStorage.getItem('token'),
      'Content-Type': 'application/json'
    },
    data: uploadNoticeForm.value
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotific('green', res?.data?.data);
      fetchNotice();
    } else {
      showMessageNotific('red', res?.data?.message);
    }
  }).catch(err => {
    console.error(err);
    showMessageNotific('red', '发布失败！');
  })
}

onMounted(() => {
  fetchNotice();
})
</script>

<template>
  <div class="manage_notice_box">
    <div class="all_notice">
      <div class="title">
        <p>所有您可以处理的公告</p>
        <div class="search_bar">
          <input type="text" placeholder="输入您要搜索的公告或关键字"/>
          <button class="button">搜索</button>
        </div>
        <button class="button">发布新公告</button>
      </div>
      <div class="notice_item_box">
        <div class="notice_item" v-for="(item, index) in noticeList" :key="index">
          <h4>{{item.title}}</h4>
          <hr/>
          <div>内容：{{item.content}}</div>
          <div>最后编辑：{{timestampToTime(item.last_date)}}</div>
          <div>首次编辑：{{timestampToTime(item.upload_date)}}</div>
          <div class="notice_item_button_box">
            <button class="button" type="button">修改</button>
            <button class="button" type="button" @click="deleteNoticeClicked(item.notice_id)">删除</button>
          </div>
        </div>
      </div>
    </div>
    <div class="upload_notice_box">
      <h3>发布公告</h3>
      <el-form label-width="auto" :model="uploadNoticeForm" @submit.prevent="uploadNoticeClicked">
        <el-form-item label="标题：">
          <el-input type="text" placeholder="请简洁输入" required v-model="uploadNoticeForm.title"/>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input type="textarea" rows="4" placeholder="最多300字" required v-model="uploadNoticeForm.content"/>
        </el-form-item>
        <el-button native-type="submit" type="primary" style="width: 100px">发布</el-button>
        <el-button native-type="button" type="warning" style="width: 100px">重置</el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="sass">
.manage_notice_box
  flex: 1
  width: 100%
  .upload_notice_box
    padding: 20px
    h3
      margin: 0 auto 20px auto
</style>