<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {BlogBriefImpl} from "@/interfaces/BlogImpl";
import {httpSpring} from "@/utils/http";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";
import {timestampToTime} from "@/utils/TimestampToTime";
import {PriceTag} from "@element-plus/icons-vue";
import {useBlogContentStore} from "@/stores/Blog/BlogContentStore";
const blogContentStore = useBlogContentStore();

const blogBriefList = ref<Array<BlogBriefImpl> | null>(null);

const blogItemClicked = (blogId: string) => {
  blogContentStore.changeBlogContentViewShow();
  blogContentStore.infoBlogId(blogId);
}

function fetchBlog() {
  httpSpring({
    url: 'api/blog/new_brief',
    method: 'GET'
  }).then(res => {
    if (res?.data?.code === 0) {
      blogBriefList.value = res?.data?.data;
      if (blogBriefList.value) {
        for (let i = 0; i < blogBriefList.value.length; i++) {
          httpSpring({
            url: 'users/other/nickname',
            method: 'GET',
            params: {uuid: blogBriefList.value[i].author}
          }).then(res => {
            if (res?.data?.code === 0) {
              if (blogBriefList.value) blogBriefList.value[i].author_cn = res?.data?.data;
            }
          }).catch(() => {showExceptionNotice();})
        }
      }
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

onMounted(() => {
  fetchBlog();
})
</script>

<template>
  <div class="blog_new_item_box" v-if="blogBriefList">
    <div class="blog_new_item" v-for="item in blogBriefList" :key="item.blog_id" @click="blogItemClicked(item.blog_id)">
      <div class="blog_new_item_cover_box" v-if="item.cover_image_800">
        <img class="blog_new_item_cover" :src="item.cover_image_800" alt="blog_cover_image"/>
      </div>
      <div class="blog_new_item_cover_box" v-else-if="item.cover_image">
        <img class="blog_new_item_cover" :src="item.cover_image" alt="blog_cover_image"/>
      </div>
      <p class="blog_new_item_name">{{item.name}}</p>
      <div class="blog_new_item_detail">
        <div class="blog_new_item_label_box" v-if="item.label">
          <span class="blog_new_item_label" v-for="(itemLabel, index) in item.label?.split('#')" :key="index">
            <el-icon style="transform: rotateZ(45deg)"><PriceTag /></el-icon>{{itemLabel}}
          </span>
        </div>
        <div class="blog_new_item_right_bottom">
          <p class="blog_new_item_author">编辑者：{{item.author_cn}}</p>
          <p class="blog_new_item_last">最后修改时间：{{timestampToTime(item.last_date)}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.blog_new_item_box{
  .blog_new_item:hover{
    background-color: #ffffff80;
  }
  .blog_new_item{
    transition: .8s ease;
    margin-bottom: 20px;
    height: calc(100vw * .2);
    background-color: #ffffff50;
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    border: #ffffff50 3px solid;
    .blog_new_item_cover_box{
      width: 100%;
      height: 59%;
      overflow: hidden;
      position: relative;
      .blog_new_item_cover:hover{
        width: 120%;
      }
      .blog_new_item_cover{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: .3s ease;
        width: 100%;
      }
    }
    .blog_new_item_name:hover{
      letter-spacing: 2px;
      cursor: pointer;
    }
    .blog_new_item_name{
      transition: .3s ease;
      margin: 0;
      font-size: 20px;
      font-weight: bold;
      position: absolute;
      top: 45%;
      background-color: #ffffff50;
      border: 1px solid #fff;
      padding: 10px;
      backdrop-filter: blur(5px);
      color: #57505d;
    }
    .blog_new_item_detail{
      display: flex;
      color: #36303a;
      flex-direction: column;
      .blog_new_item_label_box {
        padding: 10px;
        display: flex;
        flex-direction: row;
        gap: 10px;
        .blog_new_item_label:hover{
          font-weight: 800;
          cursor: pointer;
        }
        .blog_new_item_label{
          display: flex;
          align-items: center;
        }
      }
      .blog_new_item_right_bottom{
        display: flex;
        align-items: end;
        flex-direction: column;
        gap: 5px;
        padding: 10px;
        p {
          margin: 0;
        }
      }
    }
  }
}
</style>