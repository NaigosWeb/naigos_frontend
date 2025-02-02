<script setup lang="ts">
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";
import {httpSpring} from "@/utils/http";
import type {BlogImpl} from "@/interfaces/BlogImpl";
const route = useRoute();

const blogDetail = ref<BlogImpl | null>(null);

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
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

onMounted(() => {
  const params = route.params;
  if (params.blog_id) {
    fetchBlog(params.blog_id.toString());
  }
})
</script>

<template>
  <div class="blog_content_box" v-if="blogDetail">
    <div class="blog_content_title_box">
      <img class="blog_content_title_cover" v-if="blogDetail.cover_image" :src="blogDetail.cover_image" alt="cover_image"/>
      <h1 class="blog_content_title_name">{{blogDetail.name}}</h1>
    </div>
  </div>
  <div class="blog_content_box_no" v-else></div>
</template>

<style scoped lang="css">
.blog_content_box{
  .blog_content_title_box {
    text-align: center;
    .blog_content_title_cover{
      width: 100%;
    }
  }
}
</style>