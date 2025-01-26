<script setup lang="ts">
import BlogNewTitleComp from "@/components/Blog/BlogNew/BlogNewTitleComp.vue";
import BlogNewListComp from "@/components/Blog/BlogNew/BlogNewListComp.vue";


</script>

<template>
  <div class="blog_new_box">
    <BlogNewTitleComp/>
    <BlogNewListComp/>
  </div>
</template>

<style scoped lang="css">
.blog_new_box {
  width: 100%;
  max-height: calc(100vh - 150px);
  overflow: auto;
}
</style>