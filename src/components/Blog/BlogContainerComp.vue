<script setup lang="ts">
import BlogNewComp from "@/components/Blog/BlogNew/BlogNewComp.vue";
import BlogNewCmtComp from "@/components/Blog/BlogNewCmt/BlogNewCmtComp.vue";
import BlogDateComp from "@/components/Blog/BlogDateComp.vue";
import BlogClassifyComp from "@/components/Blog/BlogClassify/BlogClassifyComp.vue";
import BlogUserCardComp from "@/components/Blog/BlogUserCard/BlogUserCardComp.vue";
</script>

<template>
  <div class="blog_container">
    <div class="blog_container_left blog_container_subbox">
      <BlogUserCardComp/>
      <BlogClassifyComp/>
    </div>
    <div class="blog_container_middle blog_container_subbox">
      <BlogNewComp/>
    </div>
    <div class="blog_container_right blog_container_subbox">
      <BlogDateComp/>
      <BlogNewCmtComp/>
    </div>
  </div>
</template>

<style scoped lang="css">
.blog_container{
  width: 90%;
  margin: 20px auto 0 auto;
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  .blog_container_subbox1{
    background-color: #ffffff50;
    border: white 5px solid;
    border-radius: 30px;
  }
  .blog_container_left{
    padding: 10px;
    width: 350px;
  }
  .blog_container_middle{
    padding: 10px;
    width: 800px;
  }
  .blog_container_right{
    padding: 10px;
    width: 350px;
  }
}
</style>