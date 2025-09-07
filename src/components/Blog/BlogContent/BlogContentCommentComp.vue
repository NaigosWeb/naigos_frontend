<script setup lang="ts">
// 导入默认头像图片
import defaultAvatar from "@/assets/About/default_avatar.jpg";

// 导入 HTTP 请求工具函数
import { httpSpring } from "@/utils/http";

// 导入消息通知工具函数
import { showExceptionNotice, showMessageNotice } from "@/utils/MsgNotific";

// 导入 Vue 的生命周期钩子 onMounted 和响应式引用 ref
import { onMounted, ref } from "vue";

// 导入博客评论和回复接口类型 BlogCommentAndReplyImpl
import type { BlogCommentAndReplyImpl } from "@/interfaces/BlogImpl";

// 导入博客内容存储的 Pinia store
import { useBlogContentStore } from "@/stores/Blog/BlogContentStore";

// 导入月亮图标图片
import moon100 from "@/assets/Blog/moon_100.png";

// 导入时间戳转换为时间的工具函数
import { timestampToTime } from "../../../utils/TimestampToTime";

// 创建博客内容存储的实例
const blogContentStore = useBlogContentStore();

// 定义响应式引用 blogCommentsAndReplies，用于存储博客评论和回复列表
const blogCommentsAndReplies = ref<Array<BlogCommentAndReplyImpl> | null>(null);

// 定义响应式引用 blogCommentText，用于存储当前输入的评论内容
const blogCommentText = ref<string | null>(null);

// 定义响应式引用 isBlogCommentReplyTextShow，用于控制回复评论输入框的显示
const isBlogCommentReplyTextShow = ref<boolean>(false);

// 定义响应式引用 blogCommentReplyText，用于存储当前输入的回复评论内容
const blogCommentReplyText = ref<string | null>(null);

// 定义响应式引用 commentId，用于存储当前评论的 ID
const commentId = ref<string | null>(null);

// 上传回复评论的函数
const uploadCommentReply = () => {
  // 检查回复评论内容和评论 ID 是否为空
  if (blogCommentReplyText.value === null || commentId.value === null) {
    showMessageNotice('red', '缺少内容！');
    return;
  }
  httpSpring({
    url: 'api/blog/comment/upload_reply',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem('token')
    },
    data: {
      comment_id: commentId.value,
      content: blogCommentReplyText.value
    }
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotice('green', res?.data?.data);
      isBlogCommentReplyTextShow.value = false;
      // 重新获取博客评论
      fetchBlogComments(blogContentStore.blogId);
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => { showExceptionNotice(); });
};

// 上传评论的函数
const uploadComment = () => {
  // 检查评论内容是否为空
  if (blogCommentText.value === null) {
    showMessageNotice('red', '缺少内容！');
    return;
  }
  httpSpring({
    url: 'api/blog/comment/upload',
    method: 'POST',
    headers: {
      Authorization: window.localStorage.getItem('token'),
      "Content-Type": "application/json"
    },
    data: {
      blog_id: blogContentStore.blogId,
      content: blogCommentText.value
    }
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotice('green', res?.data?.data);
      // 重新获取博客评论
      fetchBlogComments(blogContentStore.blogId);
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => { showExceptionNotice(); });
};

// 显示回复评论输入框的函数
const blogCommentReplyClicked = (comment_id: string) => {
  commentId.value = comment_id;
  isBlogCommentReplyTextShow.value = true;
};

// 根据博客 ID 获取博客评论和回复的函数
const fetchBlogComments = (blogId: string) => {
  httpSpring({
    url: 'api/blog/comment/get',
    method: 'GET',
    params: {
      access: 'blog_id',
      value: blogId,
      is_reply: true
    }
  }).then(res => {
    if (res?.data?.code === 0) {
      blogCommentsAndReplies.value = res?.data?.data;
      if (!blogCommentsAndReplies.value) return;

      // 遍历所有评论
      for (let i = 0; i < blogCommentsAndReplies.value.length; i++) {
        // 遍历每个评论的回复
        for (let j = 0; j < blogCommentsAndReplies.value[i].replies.length; j++) {
          httpSpring({
            url: 'users/other/archive',
            method: 'GET',
            params: { uuid: blogCommentsAndReplies.value[i].replies[j].author }
          }).then(res => {
            if (res?.data?.code === 0) {
              if (!blogCommentsAndReplies.value) return;
              // 设置回复评论的作者昵称和头像
              blogCommentsAndReplies.value[i].replies[j].author_cn = res.data?.data?.nickname as string;
              blogCommentsAndReplies.value[i].replies[j].avatar = res.data?.data?.avatar as string;
            }
          });
        }

        // 获取评论的作者信息
        httpSpring({
          url: 'users/other/archive',
          method: 'GET',
          params: { uuid: blogCommentsAndReplies.value[i].comment.author }
        }).then(res => {
          if (res?.data?.code === 0) {
            if (blogCommentsAndReplies.value) {
              // 设置评论的作者昵称和头像
              blogCommentsAndReplies.value[i].comment.author_cn = res?.data?.data?.nickname as string;
              blogCommentsAndReplies.value[i].comment.avatar = res?.data?.data?.avatar as string;
            }
          }
        });
      }
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => { showExceptionNotice(); });
};

// 组件挂载后，根据存储的博客 ID 获取博客评论
onMounted(() => {
  fetchBlogComments(blogContentStore.blogId);
});
</script>

<template>
  <el-dialog v-model="isBlogCommentReplyTextShow" title="追加回复评论" append-to-body>
    <div style="display: flex; flex-direction: column; gap: 10px">
      <!-- 回复评论的输入框 -->
      <el-input type="textarea" placeholder="填写您的评论！" v-model="blogCommentReplyText"/>
      <!-- 发布回复评论的按钮 -->
      <el-button type="primary" native-type="button" @click="uploadCommentReply">发布</el-button>
    </div>
  </el-dialog>
  <div class="blog_content_comment_box">
    <div class="blog_content_comment_title">
      <!-- 评论标题中的月亮图标 -->
      <img class="blog_content_comment_title_moon" :src="moon100" alt="moon"/>
      <div class="blog_content_comment_title_character">
        <!-- 评论标题（中文） -->
        <h2 class="blog_content_comment_title_cn blog_content_comment_title_text">评论</h2>
        <!-- 评论标题（英文） -->
        <p class="blog_content_comment_title_en blog_content_comment_title_text">Comments</p>
      </div>
    </div>
    <div class="blog_content_comment_textarea" style="display: flex; flex-direction: column; gap: 10px">
      <!-- 评论输入框 -->
      <el-input type="textarea" placeholder="填写您的评论！" v-model="blogCommentText"/>
      <!-- 发布评论的按钮 -->
      <el-button type="success" @click="uploadComment" native-type="button">发布</el-button>
    </div>
    <div class="blog_content_comment_item_box" v-if="blogCommentsAndReplies && 0 < blogCommentsAndReplies.length">
      <!-- 遍历每个评论 -->
      <div class="blog_content_comment_item" v-for="(item, index) in blogCommentsAndReplies" :key="index">
        <div class="blog_content_comment_item_user_detail">
          <!-- 评论作者的头像 -->
          <img class="blog_content_comment_item_avatar" :src="item.comment.avatar || defaultAvatar" alt="avatar"/>
          <div class="blog_content_comment_item_name_time">
            <!-- 评论作者的昵称 -->
            <p class="blog_content_comment_item_nickname">{{ item.comment?.author_cn || '未知用户' }}</p>
            <!-- 评论的上传时间 -->
            <p class="blog_content_comment_item_uptime">{{ timestampToTime(item.comment.upload_time) }}</p>
          </div>
          <!-- 追加回复评论的按钮 -->
          <el-button style="background-color: #ffffff50" @click="blogCommentReplyClicked(item.comment.comment_id)">追评</el-button>
        </div>
        <!-- 评论的内容 -->
        <div class="blog_content_comment_item_content">{{ item.comment.content }}</div>
        <!-- 如果有回复评论，则显示回复评论 -->
        <div class="blog_content_comment_reply_item_box" v-if="item.replies.length > 0">
          <div class="blog_content_comment_reply_item" v-for="(itemReply, indexReply) in item.replies" :key="indexReply">
            <div class="blog_content_comment_reply_item_user_detail">
              <!-- 回复评论作者的头像 -->
              <img class="blog_content_comment_item_avatar blog_content_comment_reply_item_avatar" :src="itemReply.avatar || defaultAvatar" alt="avatar"/>
              <div class="blog_content_comment_reply_item_name_time">
                <!-- 回复评论作者的昵称 -->
                <p class="blog_content_comment_reply_item_nickname">{{ itemReply.author_cn || '未知用户' }}</p>
                <!-- 回复评论的上传时间 -->
                <p class="blog_content_comment_replay_item_uptime">{{ timestampToTime(itemReply.upload_time) }}</p>
              </div>
            </div>
            <!-- 回复评论的内容 -->
            <div class="blog_content_comment_reply_item_content">{{ itemReply.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
/* 回复评论的作者头像样式 */
.blog_content_comment_item_avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: #f0d4eb solid 2px;
}

/* 回复评论的回复作者头像样式 */
.blog_content_comment_reply_item_avatar {
  width: 30px;
  height: 30px;
}

/* 评论框的整体样式 */
.blog_content_comment_box {
  width: 50%;
  margin: 0 auto;
  .blog_content_comment_item_box {
    .blog_content_comment_reply_item_box {
      width: 95%;
      margin: 10px 0 0 auto;
      .blog_content_comment_reply_item {
        .blog_content_comment_reply_item_user_detail {
          display: flex;
          flex-direction: row;
          gap: 10px;
          .blog_content_comment_reply_item_name_time {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 5px;
            .blog_content_comment_reply_item_nickname {
              font-weight: bold;
            }
            p {
              margin: 0;
              color: #57505d;
            }
          }
        }
        .blog_content_comment_reply_item_content {
          width: 95%;
          margin: 0 0 0 auto;
        }
      }
    }
    padding: 20px;
    .blog_content_comment_item {
      margin-bottom: 20px;
      .blog_content_comment_item_user_detail {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        .blog_content_comment_item_name_time {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .blog_content_comment_item_nickname {
            font-size: 18px;
            letter-spacing: 1px;
            font-weight: bold;
          }
          p {
            color: #57505d;
            margin: 0;
          }
        }
      }
      .blog_content_comment_item_content {
        width: 95%;
        margin: 0 0 0 auto;
      }
    }
  }
}

/* 评论标题的样式 */
.blog_content_comment_title {
  margin-bottom: 10px;
  background-color: #ffffff30;
  padding: 10px;
  border-radius: 20px;
  border: #ffffff50 3px solid;
  height: 30px;
  display: flex;
  align-items: center;
  .blog_content_comment_title_moon {
    height: 100%;
  }
  .blog_content_comment_title_character {
    display: flex;
    align-items: baseline;
    gap: 5px;
    .blog_content_comment_title_text {
      margin: 0;
      color: #fff;
    }
    .blog_content_comment_title_cn {
      letter-spacing: 1px;
    }
  }
}
</style>
