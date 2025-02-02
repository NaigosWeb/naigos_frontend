<script setup lang="ts">
import defaultAvatar from "@/assets/About/default_avatar.jpg";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import {onMounted, ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
import {StarFilled, Tools} from "@element-plus/icons-vue";
import {httpSpring} from "@/utils/http";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";
const userDetailStore = useUserDetailStore();

interface DataImpl {
  title: string; content: number;
}
interface BlogUserCardImpl {
  blog_amount: number;
}

const userArchive = ref<UserArchiveImpl>(userDetailStore.userDetails);
const userBlogData = ref<Array<DataImpl>>([
  {title: '文章数', content: 0},
  {title: '关注者', content: 0},
  {title: '粉丝数', content: 0}
]);
const blogUserCard = ref<BlogUserCardImpl | null>(null);

const fetchBlogUserCard = () => {
  httpSpring({
    url: 'api/blog/information/usercard',
    method: 'GET',
    headers: {
      Authorization: window.localStorage.getItem('token'),
    }
  }).then(res => {
    if (res?.data?.code === 0) {
      blogUserCard.value = res?.data?.data;
      console.log(res?.data?.data);
      if (blogUserCard.value) {
        userBlogData.value[0].content = blogUserCard.value.blog_amount;
      }
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

onMounted(() => {
  fetchBlogUserCard();
})

watch(() => userDetailStore.userDetails, newVal => {
  userArchive.value = newVal;
})
</script>

<template>
  <div class="blog_usercard_box">
    <img class="blog_usercard_avatar" :src="userArchive.avatar || defaultAvatar" alt="avatar"/>
    <div class="blog_usercard_placeholder"></div>
    <div class="blog_usercard_detail_box">
      <div class="blog_usercard_detail_placeholder"></div>
      <div class="blog_usercard_detail_archive">
        <p class="blog_usercard_detail_archive_nickname">{{userArchive.nickname}}</p>
        <p class="blog_usercard_detail_archive_email">{{userArchive.email}}</p>
      </div>
      <div class="blog_usercard_detail_data">
        <div class="blog_usercard_detail_data_item" v-for="(item, index) in userBlogData" :key="index">
          <p class="blog_usercard_detail_data_title">{{item.title}}</p>
          <p class="blog_usercard_detail_data_content">{{item.content}}</p>
        </div>
      </div>
      <div class="blog_usercard_detail_item_box">
        <div class="blog_usercard_detail_item">
          <el-icon><StarFilled /></el-icon>我的收藏
        </div>
        <div class="blog_usercard_detail_item">
          <el-icon><Tools /></el-icon>账号服务
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css">
:root{
  --avatar_size: 80px
}
.blog_usercard_box {
  margin-bottom: 30px;
  position: relative;
  .blog_usercard_placeholder{
    height: calc(var(--avatar_size) / 2);
    width: 100%;
  }
  .blog_usercard_detail_box {
    height: auto;
    background-color: #ffffff80;
    border: #ffffff50 solid 3px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .blog_usercard_detail_placeholder{
      height: calc(var(--avatar_size) / 2);
      width: 100%;
    }
    .blog_usercard_detail_archive{
      text-align: center;
      .blog_usercard_detail_archive_nickname{
        color: #57505d;
        font-size: 20px;
        margin: 5px auto;
        font-weight: bold;
      }
      .blog_usercard_detail_archive_email{
        color: #57505d;
        font-size: 14px;
        margin: 2px auto;
      }
    }
    .blog_usercard_detail_data {
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      gap: 30px;
      .blog_usercard_detail_data_item{
        color: #57505d;
        display: flex;
        flex-direction: column;
        align-items: center;
        p{
          margin: 0;
        }
        .blog_usercard_detail_data_title{
          font-weight: bold;
        }
      }
    }
    .blog_usercard_detail_item_box{
      width: 80%;
      margin: 0 auto;
      .blog_usercard_detail_item:first-child{
        margin-top: 10px;
      }
      .blog_usercard_detail_item:last-child{
        margin-bottom: 30px;
      }
      .blog_usercard_detail_item:hover{
        cursor: pointer;
        background-color: #ffffff80;
      }
      .blog_usercard_detail_item {
        transition: .3s ease;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 10px;
        border-radius: 20px;
        border: #ffffff50 solid 3px;
        margin-bottom: 10px;
        color: #57505d;
        font-weight: bold;
      }
    }
  }
  .blog_usercard_avatar {
    position: absolute;
    width: var(--avatar_size);
    height: var(--avatar_size);
    border-radius: 50%;
    border: #f0d4eb solid 3px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>