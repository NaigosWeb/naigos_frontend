<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 导入 HTTP 请求工具函数
import { httpSpring } from "@/utils/http";

const props = defineProps({
  blogId: {
    type: String,
    required: true
  }
});

const isLiked = ref(false);
const likeCount = ref(0);

onMounted(() => {
  fetchLikeStatus();
  fetchLikeCount();
});

const fetchLikeStatus = async () => {
  try {
    const response = await httpSpring.get(`/api/blog/BLF/getBlogLikeCount?blog_id=${props.blogId}`);
    if (response.data.code === 0) {
      // 假设后端返回的数据结构中有某个字段表示当前用户是否已点赞
      // 这里假设为 likedByCurrentUser 字段
      isLiked.value = response.data.likedByCurrentUser || false;
    }
  } catch (error) {
    console.error('Failed to fetch like status:', error);
  }
};

const fetchLikeCount = async () => {
  try {
    const response = await httpSpring.get(`/api/blog/BLF/getBlogLikeCount?blog_id=${props.blogId}`);
    if (response.data.code === 0) {
      likeCount.value = response.data.like_count;
    }
  } catch (error) {
    console.error('Failed to fetch like count:', error);
  }
};

const handleLike = async () => {
  try {
    const toggleType = !isLiked.value;
    const response = await httpSpring.post('/api/blog/BLF/addBlogLike', null, {
      params: {
        toggle_type: toggleType,
        blog_id: props.blogId
      },
      headers: {
        Authorization: localStorage.getItem('token') || ''
      }
    });

    if (response.data.code === 0) {
      isLiked.value = toggleType;
      likeCount.value += toggleType ? 1 : -1;
    } else {
      console.error('Failed to update like status:', response.data.message);
    }
  } catch (error) {
    console.error('Failed to update like status:', error);
  }
};
</script>

<template>
  <div class="blog_content_like_and_collect">
    <div class="blog_content_comment_title_moon">
      <!-- 这里可以放置点赞图标 -->
      <img 
        :src="isLiked ? '/src/assets/Blog/like-iconDONE.svg' : '/src/assets/Blog/like-icon.svg'" 
        alt="Like" 
        @click="handleLike" 
        style="cursor: pointer; height: 100%;"
      >
    </div>
    <div class="blog_content_comment_title_character">
      <div class="blog_content_comment_title_text blog_content_comment_title_cn">
        {{ likeCount }}
      </div>
    </div>

     <div class="blog_content_comment_title_moon">
      <!-- 这里可以放置收藏图标 -->
      <img src="/src/assets/Blog/collect-iconDONE.svg" 
        alt="Collect" 
        style="cursor: pointer; height: 100%;"
      >
    </div>
    <div class="blog_content_comment_title_character">
      <div class="blog_content_comment_title_text blog_content_comment_title_cn">
      </div>
    </div> 
  </div>
</template>

<style scoped lang="css">
.blog_content_like_and_collect {
  width: 50%;
  margin: 0 auto;
  margin-bottom: 10px;
  background-color: #ffffff30;
  padding: 10px;
  border-radius: 20px;
  border: #ffffff50 3px solid;
  height: 30px;
  display: flex;
  align-items: center;
}

.blog_content_comment_title_moon {
  height: 100%;
  margin-right: 10px; /* 添加间距以便图标和数字之间有间隔 */
  align-items: center;
  margin-left: 30%;
}

.blog_content_comment_title_character {
  gap: 5px;
  display: flex;
  float: left;
  margin-top: 0.5%;
}

.blog_content_comment_title_text {
  color: #000000;
}

.blog_content_comment_title_cn {
  letter-spacing: 1px;
}
</style>
