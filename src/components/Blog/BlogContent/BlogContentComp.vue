<script setup lang="ts">
import defaultAvatar from "@/assets/About/default_avatar.jpg";
import {onMounted, ref} from "vue";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";
import {httpSpring} from "@/utils/http";
import type {BlogImpl} from "@/interfaces/BlogImpl";
import {useBlogContentStore} from "@/stores/Blog/BlogContentStore";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
import {timestampToTime} from "@/utils/TimestampToTime";
import {Close} from "@element-plus/icons-vue";
import BlogContentCommentComp from "@/components/Blog/BlogContent/BlogContentCommentComp.vue";
const blogContentStore = useBlogContentStore();

const blogDetail = ref<BlogImpl | null>(null);
const uploaderArchive = ref<UserArchiveImpl | null>(null);

const closeClicked = () => {
  blogContentStore.changeBlogContentViewShow();
}

const fetchArchive = (uuid: string) => {
  httpSpring({
    url: 'users/other/archive',
    method: 'GET',
    params: {uuid: uuid},
  }).then(res => {
    if (res?.data?.code === 0) {
      uploaderArchive.value = res?.data?.data;
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

const fetchBlog = (blogId: string) => {
  httpSpring({
    url: 'api/blog/only',
    method: 'GET',
    params: {
      blog_id: blogId,
    }
  }).then(res => {
    if (res?.data?.code === 0) {
      blogDetail.value = res?.data?.data;
      if (blogDetail.value) {
        fetchArchive(blogDetail.value.author);
      }
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

onMounted(() => {
  fetchBlog(blogContentStore.blogId);
})
</script>

<template>
  <div class="blog_content_box">
    <div v-if="blogDetail && uploaderArchive">
      <div class="blog_content_title_box">
        <el-icon @click="closeClicked" class="close_button" size="64" color="#57505d"><Close/></el-icon>
        <img class="blog_content_title_cover" v-if="blogDetail.cover_image_1200" :src="blogDetail.cover_image_1200" alt="cover_image"/>
        <img class="blog_content_title_cover" v-else-if="blogDetail.cover_image_800" :src="blogDetail.cover_image_800" alt="cover_image"/>
        <img class="blog_content_title_cover" v-else-if="blogDetail.cover_image" :src="blogDetail.cover_image" alt="cover_image"/>
        <div class="blog_content_title_author_detail">
          <h1 class="blog_content_title_name">{{blogDetail.name}}</h1>
          <div class="blog_content_title_author_detail_sub">
            <img class="blog_content_title_avatar" :src="uploaderArchive?.avatar || defaultAvatar" alt="avatar">
            <div class="blog_content_title_name_time_box">
              <p class="blog_content_title_author">{{uploaderArchive.nickname}}</p>
              <p class="blog_content_title_lastdate">最后编辑时间：{{timestampToTime(blogDetail.last_date)}}</p>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 70%; margin: 0 auto;" class="blog_content_editor ql-editor" v-html="blogDetail.content"></div>
      <BlogContentCommentComp/>
    </div>
    <div v-else></div>
  </div>
</template>

<style scoped lang="css">
.blog_content_box, blog_content_box_no{
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  z-index: 30;
  overflow: auto;
  .blog_content_title_box {
    color: #342f39;
    width: 100%;
    height: 300px;
    position: relative;
    overflow: hidden;
    .blog_content_title_cover{
      position: absolute;
      width: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: .8;
    }
    .blog_content_title_author_detail{
      width: 50%;
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      .blog_content_title_author_detail_sub{
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        .blog_content_title_avatar{
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid #f0d4eb;
        }
        .blog_content_title_name_time_box{
          display: flex;
          flex-direction: column;
          gap: 5px;
          p{
            margin: 0;
          }
          .blog_content_title_author{
            font-size: 18px;
            font-weight: bold;
          }
        }
      }
    }
  }
}
.close_button{
  position: absolute;
  z-index: 30;
  transition: .3s ease;
}
.close_button:hover{
  transform: rotate(45deg);
  cursor: pointer;
}
</style>