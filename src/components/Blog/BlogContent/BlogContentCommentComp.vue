<script setup lang="ts">
import defaultAvatar from "@/assets/About/default_avatar.jpg";
import {httpSpring} from "@/utils/http";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";
import {onMounted, ref} from "vue";
import type {BlogCommentAndReplyImpl} from "@/interfaces/BlogImpl";
import {useBlogContentStore} from "@/stores/Blog/BlogContentStore";
import moon100 from "@/assets/Blog/moon_100.png";
import {timestampToTime} from "../../../utils/TimestampToTime";
const blogContentStore = useBlogContentStore();

const blogCommentsAndReplies = ref<Array<BlogCommentAndReplyImpl> | null>(null);
const blogCommentText = ref<string | null>(null);
const isBlogCommentReplyTextShow = ref<boolean>(false);
const blogCommentReplyText = ref<string | null>(null);
const commentId = ref<string | null>(null);

const uploadComment = () => {
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
      fetchBlogComments(blogContentStore.blogId);
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

const blogCommentReplyClicked = (comment_id: string) => {
  commentId.value = comment_id;
  isBlogCommentReplyTextShow.value = true;
}

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
      for (let i = 0; i < blogCommentsAndReplies.value.length; i++) {
        for (let j = 0; j < blogCommentsAndReplies.value[i].replies.length; j++) {
          httpSpring({
            url: 'users/other/archive',
            method: 'GET',
            params: {uuid: blogCommentsAndReplies.value[i].replies[j].author}
          }).then(res => {
            if (res?.data?.code === 0) {
              if (!blogCommentsAndReplies.value) return;
              blogCommentsAndReplies.value[i].replies[j].author_cn = res.data?.data?.nickname as string;
              blogCommentsAndReplies.value[i].replies[j].avatar = res.data?.data?.avatar as string;
            }
          })
        }
        httpSpring({
          url: 'users/other/archive',
          method: 'GET',
          params: {uuid: blogCommentsAndReplies.value[i].comment.author}
        }).then(res => {
          if (res?.data?.code === 0) {
            if (blogCommentsAndReplies.value) {
              blogCommentsAndReplies.value[i].comment.author_cn = res?.data?.data?.nickname as string;
              blogCommentsAndReplies.value[i].comment.avatar = res?.data?.data?.avatar as string;
            }
          }
        })
      }
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

onMounted(() => {
  fetchBlogComments(blogContentStore.blogId);
})
</script>

<template>
  <el-dialog v-model="isBlogCommentReplyTextShow" title="追加回复评论">
    <div style="display: flex; flex-direction: column; gap: 10px">
      <el-input type="textarea" placeholder="填写您的评论！"/>
      <el-button type="primary" native-type="button">发布</el-button>
    </div>
  </el-dialog>
  <div class="blog_content_comment_box">
    <div class="blog_content_comment_title">
      <img class="blog_content_comment_title_moon" :src="moon100" alt="moon"/>
      <div class="blog_content_comment_title_character">
        <h2 class="blog_content_comment_title_cn blog_content_comment_title_text">评论</h2>
        <p class="blog_content_comment_title_en blog_content_comment_title_text">Comments</p>
      </div>
    </div>
    <div class="blog_content_comment_textarea" style="display: flex; flex-direction: column; gap: 10px">
      <el-input type="textarea" placeholder="填写您的评论！" v-model="blogCommentText"/>
      <el-button type="success" @click="uploadComment" native-type="button">发布</el-button>
    </div>
    <div class="blog_content_comment_item_box" v-if="blogCommentsAndReplies && 0 < blogCommentsAndReplies.length">
      <div class="blog_content_comment_item" v-for="(item, index) in blogCommentsAndReplies" :key="index">
        <div class="blog_content_comment_item_user_detail">
          <img class="blog_content_comment_item_avatar" :src="item.comment.avatar || defaultAvatar" alt="avatar"/>
          <div class="blog_content_comment_item_name_time">
            <p class="blog_content_comment_item_nickname">{{item.comment?.author_cn || '未知用户'}}</p>
            <p class="blog_content_comment_item_uptime">{{timestampToTime(item.comment.upload_time)}}</p>
          </div>
          <el-button style="background-color: #ffffff50" @click="blogCommentReplyClicked(item.comment.comment_id)">追评</el-button>
        </div>
        <div class="blog_content_comment_item_content">{{item.comment.content}}</div>
        <div class="blog_content_comment_reply_item_box" v-if="item.replies.length > 0">
          <div class="blog_content_comment_reply_item" v-for="(itemReply, indexReply) in item.replies" :key="indexReply">
            <div class="blog_content_comment_reply_item_user_detail">
              <img class="blog_content_comment_item_avatar blog_content_comment_reply_item_avatar" :src="itemReply.avatar || defaultAvatar" alt="avatar"/>
              <div class="blog_content_comment_reply_item_name_time">
                <p class="blog_content_comment_reply_item_nickname">{{itemReply.author_cn || '未知用户'}}</p>
                <p class="blog_content_comment_replay_item_uptime">{{timestampToTime(itemReply.upload_time)}}</p>
              </div>
            </div>
            <div class="blog_content_comment_reply_item_content">{{itemReply.content}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.blog_content_comment_item_avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: #f0d4eb solid 2px;
}
.blog_content_comment_reply_item_avatar {
  width: 30px;
  height: 30px;
}
.blog_content_comment_box {
  width: 50%;
  margin: 0 auto;
  .blog_content_comment_item_box {
    .blog_content_comment_reply_item_box {
      width: 95%;
      margin: 10px 0 0 auto;
      .blog_content_comment_reply_item{
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
.blog_content_comment_title {
  margin-bottom: 10px;
  background-color: #ffffff30;
  padding: 10px;
  border-radius: 20px;
  border: #ffffff50 3px solid;
  height: 30px;
  display: flex;
  align-items: center;
  .blog_content_comment_title_moon{
    height: 100%;
  }
  .blog_content_comment_title_character{
    display: flex;
    align-items: baseline;
    gap: 5px;
    .blog_content_comment_title_text{
      margin: 0;
      color: #fff;
    }
    .blog_content_comment_title_cn {
      letter-spacing: 1px;
    }
  }
}
</style>