<script setup lang="ts">

import moon100 from "@/assets/Blog/moon_100.png";
</script>

<template>
  <div class="blog_classify_title">
    <img class="blog_classify_title_moon" :src="moon100" alt="moon"/>
    <div class="blog_classify_title_character">
      <h2 class="blog_classify_title_cn blog_classify_title_text">分类</h2>
      <p class="blog_classify_title_en blog_classify_title_text">Classify</p>
    </div>
  </div>
</template>

<style scoped lang="css">
.blog_classify_title {
  background-color: #ffffff30;
  padding: 10px;
  border-radius: 20px;
  border: #ffffff50 3px solid;
  height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .blog_classify_title_moon{
    height: 100%;
  }
  .blog_classify_title_character{
    display: flex;
    align-items: baseline;
    gap: 5px;
    .blog_classify_title_text{
      margin: 0;
      color: #fff;
    }
    .blog_classify_title_cn {
      letter-spacing: 1px;
    }
  }
}
</style>