<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {BlogBriefImpl} from "@/interfaces/BlogImpl";
import {httpSpring} from "@/utils/http";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";

const blogBriefList = ref<Array<BlogBriefImpl> | null>(null);

function fetchBlog() {
  httpSpring({
    url: 'api/blog/all_brief',
    method: 'GET'
  }).then(res => {
    if (res?.data?.code === 0) {
      blogBriefList.value = res?.data?.data;
      if (blogBriefList.value) {
        blogBriefList.value = blogBriefList.value.slice(0, 10);
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
    <div class="blog_new_item" v-for="item in blogBriefList" :key="item.blog_id">
      <img class="blog_new_item_cover" v-if="item.cover_image" :src="item.cover_image" alt="blog_cover_image"/>
      <p class="blog_new_item_name">{{item.name}}</p>
    </div>
  </div>
</template>

<style scoped lang="css">
.blog_new_item_box{
  display: flex;
  flex-direction: column;
  gap: 20px;
  .blog_new_item{
    width: 100%;
    height: calc(100vw * .2);
    border: #57505d solid 1px;
    .blog_new_item_cover{
      width: 100%;
    }
    .blog_new_item_name{
      margin: 0;
      font-size: 20px;
      padding-left: 10px;
      font-weight: bold;
    }
  }
}
</style>