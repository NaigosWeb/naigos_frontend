<script setup lang="ts">
// 导入博客新建组件
import BlogNewComp from "@/components/Blog/BlogNew/BlogNewComp.vue";

// 导入博客分类组件
import BlogClassifyComp from "@/components/Blog/BlogClassify/BlogClassifyComp.vue";

// 导入博客用户卡片组件
import BlogUserCardComp from "@/components/Blog/BlogUserCard/BlogUserCardComp.vue";

// 导入博客新评论组件
import BlogNewCmtComp from "@/components/Blog/BlogNewCmt/BlogNewCmtComp.vue";

// 导入博客日期组件
import BlogDateComp from "@/components/Blog/BlogDateComp.vue";
</script>

<template>
  <div class="blog_container">
    <!-- 左侧子容器，包含用户卡片和分类组件 -->
    <div class="blog_container_left blog_container_subbox">
      <BlogUserCardComp/>
      <BlogClassifyComp/>
    </div>
    <!-- 中间子容器，包含新建博客组件 -->
    <div class="blog_container_middle blog_container_subbox">
      <BlogNewComp/>
    </div>
    <!-- 右侧子容器，包含日期组件和新评论组件 -->
    <div class="blog_container_right blog_container_subbox">
      <BlogDateComp/>
      <BlogNewCmtComp/>
    </div>
  </div>
</template>


<style scoped lang="css">
.blog_container {
  width: 90%;
  margin: 20px auto 0 auto;
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;

  /* 子容器的通用样式 */
  .blog_container_subbox {
    background-color: #ffffff50;
    border: white 5px solid;
    border-radius: 30px;
  }

  /* 左侧子容器的特定样式 */
  .blog_container_left {
    padding: 10px;
    width: 350px;
  }

  /* 中间子容器的特定样式 */
  .blog_container_middle {
    padding: 10px;
    width: 800px;
  }

  /* 右侧子容器的特定样式 */
  .blog_container_right {
    padding: 10px;
    width: 350px;
  }
}
</style>
