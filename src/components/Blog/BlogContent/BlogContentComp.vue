<script setup lang="ts">
// 导入默认头像图片
import defaultAvatar from "@/assets/About/default_avatar.jpg";

// 导入 Vue 的生命周期钩子 onMounted 和响应式引用 ref
import { onMounted, ref } from "vue";

// 导入消息通知工具函数
import { showExceptionNotice, showMessageNotice } from "@/utils/MsgNotific";

// 导入 HTTP 请求工具函数
import { httpSpring } from "@/utils/http";

// 导入博客接口类型 BlogImpl
import type { BlogImpl } from "@/interfaces/BlogImpl";

// 导入博客内容存储的 Pinia store
import { useBlogContentStore } from "@/stores/Blog/BlogContentStore";

// 导入用户归档接口类型 UserArchiveImpl
import type { UserArchiveImpl } from "@/interfaces/UserArchiveImpl";

// 导入时间戳转换为时间的工具函数
import { timestampToTime } from "@/utils/TimestampToTime";

// 导入 Element Plus 的 Close 图标组件
import { Close } from "@element-plus/icons-vue";

// 导入点赞、收藏功能组件
import BlogLike_CollectComp from "@/components/Blog/BlogLikeAndCollect/BlogLike_CollectComp.vue";

// 导入博客内容评论组件
import BlogContentCommentComp from "@/components/Blog/BlogContent/BlogContentCommentComp.vue";

// 创建博客内容存储的实例
const blogContentStore = useBlogContentStore();

// 定义响应式引用 blogDetail，用于存储博客详情
const blogDetail = ref<BlogImpl | null>(null);

// 定义响应式引用 uploaderArchive，用于存储博客上传者的归档信息
const uploaderArchive = ref<UserArchiveImpl | null>(null);

// 当点击关闭按钮时，隐藏博客内容视图
const closeClicked = () => {
  blogContentStore.changeBlogContentViewShow();
};

// 根据用户 UUID 获取用户归档信息
const fetchArchive = (uuid: string) => {
  httpSpring({
    url: 'users/other/archive',
    method: 'GET',
    params: { uuid: uuid },
  }).then(res => {
    if (res?.data?.code === 0) {
      uploaderArchive.value = res?.data?.data;
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => { showExceptionNotice(); });
};

// 根据博客 ID 获取博客详情
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
      if (blogDetail.value) {
        // 获取博客上传者的归档信息
        fetchArchive(blogDetail.value.author);
      }
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => { showExceptionNotice(); });
};

// 组件挂载后，根据存储的博客 ID 获取博客详情
onMounted(() => {
  fetchBlog(blogContentStore.blogId);
});
</script>

<template>
  <div class="blog_content_box">
    <!-- 如果博客详情和上传者归档信息都已加载，则显示博客内容 -->
    <div v-if="blogDetail && uploaderArchive">
      <div class="blog_content_title_box">
        <!-- 关闭按钮，点击时隐藏博客内容视图 -->
        <el-icon @click="closeClicked" class="close_button" size="64" color="#57505d">
          <Close/>
        </el-icon>
        <!-- 显示博客的封面图片 -->
        <img class="blog_content_title_cover" v-if="blogDetail.cover_image_1200" :src="blogDetail.cover_image_1200" alt="cover_image"/>
        <img class="blog_content_title_cover" v-else-if="blogDetail.cover_image_800" :src="blogDetail.cover_image_800" alt="cover_image"/>
        <img class="blog_content_title_cover" v-else-if="blogDetail.cover_image" :src="blogDetail.cover_image" alt="cover_image"/>
        <div class="blog_content_title_author_detail">
          <!-- 显示博客标题 -->
          <h1 class="blog_content_title_name">{{ blogDetail.name }}</h1>
          <div class="blog_content_title_author_detail_sub">
            <!-- 显示上传者的头像，如果没有则显示默认头像 -->
            <img class="blog_content_title_avatar" :src="uploaderArchive?.avatar || defaultAvatar" alt="avatar">
            <div class="blog_content_title_name_time_box">
              <!-- 显示上传者的昵称 -->
              <p class="blog_content_title_author">{{ uploaderArchive.nickname }}</p>
              <!-- 显示博客最后编辑时间 -->
              <p class="blog_content_title_lastdate">最后编辑时间：{{ timestampToTime(blogDetail.last_date) }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 显示博客内容，使用 quill 编辑器样式 -->
      <div style="width: 70%; margin: 0 auto;" class="blog_content_editor ql-editor" v-html="blogDetail.content"></div>
      <!-- 显示点赞、收藏功能组件 -->
      <BlogLike_CollectComp :blogId="blogDetail.blog_id"/>


      <!-- 显示博客评论组件 -->
      <BlogContentCommentComp/>
    </div>
    <!-- 如果博客详情或上传者归档信息未加载，则显示空 div -->
    <div v-else></div>
  </div>
</template>

<style scoped lang="css">
.blog_content_box, blog_content_box_no {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  z-index: 30;
  overflow: auto;
}

.blog_content_title_box {
  color: #342f39;
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;
}

.blog_content_title_cover {
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: .8;
}

.blog_content_title_author_detail {
  width: 50%;
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
}

.blog_content_title_author_detail_sub {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
}

.blog_content_title_avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #f0d4eb;
}

.blog_content_title_name_time_box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  p {
    margin: 0;
  }
}

.blog_content_title_author {
  font-size: 18px;
  font-weight: bold;
}

.close_button {
  position: absolute;
  z-index: 30;
  transition: .3s ease;
}

.close_button:hover {
  transform: rotate(45deg);
  cursor: pointer;
}
</style>
