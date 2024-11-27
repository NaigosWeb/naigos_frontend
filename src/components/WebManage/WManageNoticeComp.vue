<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import type {NaigosNoticeImpl} from "@/interfaces/NaigosNoticeImpl";
import {httpSpring} from "@/utils/http";
import {timestampToTime} from "@/utils/TimestampToTime";
import {showMessageNotice} from "@/utils/MsgNotific";
const userDetailStore = useUserDetailStore();



const noticeList = ref<Array<NaigosNoticeImpl> | null>(null);
const uploadNoticeForm = ref<{title: string, content: string}>({
  title: '',
  content: '',
});

// const fetchNotice = () => {
//   httpSpring({
//     url: 'api/notice/manage/all',
//     method: "GET",
//     headers: {Authorization: window.localStorage.getItem('token')}
//   }).then(res => {
//     if (res?.data?.code === 0){
//       noticeList.value = res?.data?.data;
//       if (noticeList.value == null || noticeList.value.length === 0) return;
//       for (let i = 0; i < noticeList.value.length; i++) {
//         httpSpring({
//           url: 'users/other/nickname',
//           method: 'GET',
//           params: {uuid: noticeList.value[i].author}
//         }).then(res => {
//           if (res?.data?.code === 0) {noticeList.value[i].authorCN = res?.data?.data;}
//           else {noticeList.value[i].authorCN = res?.data?.message;}
//         }).catch(err => {
//           console.error(err);
//           noticeList.value[i].authorCN = '请求错误';
//         })
//       }
//     }
//   }).catch(err => {
//     console.error(err);
//   })
// }

const fetchNotice = async () => {
  try {
    const res = await httpSpring({
      url: 'api/notice/manage/all',
      method: "GET",
      headers: { Authorization: window.localStorage.getItem('token') }
    });
    if (res.data.code === 0) {
      noticeList.value = res.data.data;
      if (!noticeList.value || noticeList.value.length === 0) return;
      for (let i = 0; i < noticeList.value.length; i++) {
        try {
          const userRes = await httpSpring({
            url: 'users/other/nickname',
            method: 'GET',
            params: { uuid: noticeList.value[i].author }
          });
          if (userRes.data.code === 0) {
            noticeList.value[i].authorCN = userRes.data.data;
          } else {
            noticeList.value[i].authorCN = userRes.data.message;
          }
        } catch (err) {
          console.error(err);
          if (noticeList.value && noticeList.value[i]) {
            noticeList.value[i].authorCN = '请求错误';
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};

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
      showMessageNotice('green', res?.data?.data);
      fetchNotice();
    } else {
      showMessageNotice('red', res?.data?.message);
    }
  }).catch((err) => {
    showMessageNotice('red', '操作失败！');
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
      showMessageNotice('green', res?.data?.data);
      fetchNotice();
    } else {
      showMessageNotice('red', res?.data?.message);
    }
  }).catch(err => {
    console.error(err);
    showMessageNotice('red', '发布失败！');
  })
}

onMounted( () => {
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
          <div :title="`${item.author}`">上传者：{{item?.authorCN || '加载中…'}}</div>
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
  .all_notice
    overflow: auto
    max-width: 100%
    min-width: 100%
    max-height: 500px
    border-bottom: #f0d4eb 3px solid
    box-shadow: #3b374030 0 3px 3px
    .notice_item_box
      margin: 0 auto
      display: flex
      padding: 20px
      gap: 10px
      flex-wrap: wrap
      .notice_item
        background-color: #f0d4eb40
        position: relative
        border-radius: 10px
        padding: 5px
        border: #f0d4eb 1px solid
        width: 500px
        height: 250px
        color: #5d505b
        .notice_item_button_box
          position: absolute
          bottom: 2%
          right: 2%
          .button
            width: 80px
            height: 30px
            margin-right: 5px
            background-color: #f0d4eb50
            border: #f0d4eb 1px solid
            color: #aa6872
            transition: .3s ease
          .button:last-child
            margin: 0
          .button:hover
            background-color: #f0d4eb80
            cursor: pointer
        h4
          margin: 5px auto
  .title
    width: 100%
    height: 60px
    background-color: #57505d
    display: flex
    align-items: center
    .button
      margin-right: 2%
      margin-left: auto
      background-color: #ffffff50
      border: #fff 1px solid
      border-radius: 5px
      color: white
      width: 120px
      height: 30px
      font-size: 16px
      transition: .3s ease
    .button:hover
      background-color: #ffffff80
      cursor: pointer
    .search_bar
      display: flex
      margin: 0 auto
      input
        width: 280px
        background-color: #ffffff80
        border: white 1px solid
        border-radius: 5px
      input::placeholder
        color: white
      .button
        margin-left: 10px
        width: 80px
    p
      margin-left: 2%
      font-size: 20px
      font-weight: bold
      color: #f0d4eb
  .upload_notice_box
    padding: 20px
    h3
      margin: 0 auto 20px auto
</style>