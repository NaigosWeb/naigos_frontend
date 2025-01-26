<script setup lang="ts">

import BlogNewComp from "@/components/Blog/BlogNew/BlogNewComp.vue";
</script>

<template>
  <div class="blog_container">
    <div class="blog_container_left blog_container_subbox">

    </div>
    <div class="blog_container_middle blog_container_subbox">
      <BlogNewComp/>
    </div>
    <div class="blog_container_right blog_container_subbox">

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
  .blog_container_subboxa{
    background-color: #ffffff50;
    border: white 5px solid;
    border-radius: 30px;
  }
  .blog_container_left{
    width: 25%;
  }
  .blog_container_middle{
    padding: 10px;
    flex: 1;
  }
  .blog_container_right{
    width: 25%;
  }
}
</style>