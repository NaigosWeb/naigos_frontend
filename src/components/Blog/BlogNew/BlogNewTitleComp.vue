<script setup lang="ts">
import moon100 from "@/assets/Blog/moon_100.png";
</script>

<template>
  <div class="blog_new_title">
    <img class="blog_new_title_moon" :src="moon100" alt="moon"/>
    <div class="blog_new_title_character">
      <h2 class="blog_new_title_cn blog_new_title_text">最新博客</h2>
      <p class="blog_new_title_en blog_new_title_text">Latest Blogs</p>
    </div>
  </div>
</template>

<style scoped lang="css">
.blog_new_title {
  background-color: #ffffff30;
  padding: 10px;
  border-radius: 20px;
  border: #ffffff50 3px solid;
  height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .blog_new_title_moon{
    height: 100%;
  }
  .blog_new_title_character{
    display: flex;
    align-items: baseline;
    gap: 5px;
    .blog_new_title_text{
      margin: 0;
      color: #fff;
    }
    .blog_new_title_cn {
      letter-spacing: 1px;
    }
  }
}
</style>