<script setup lang="ts">
interface NoticeImpl {
  title: string;
  content: string;
  noticeUrl?: string;
  date?: string;
}

const noticeList: NoticeImpl[] = [
  {title: 'Hello world!', content: '这是网站第一个公告！', date: '2024-10-15 21:49:55'},
  {title: 'Hello world!', content: '这是网站第一个公告！', date: '2024-10-15 21:52:27'},
  {title: '站点收录站长的成果以外，也会收录互联网上优秀的作品', content: '这是网站第一个公告！', date: '2024-10-15 22:00:41'},
]
</script>

<template>
  <div class="notice">
    <h3>公告</h3>
    <hr class="hr"/>
    <div class="notice_item_box">
      <div class="notice_item" v-for="(item, index) in noticeList" :key="index" :title="item.content">
        <div class="notice_item_content_box">
          <span class="notice_item_title">{{item.title}}</span>
          <span class="notice_item_date">{{item?.date}}</span>
        </div>
        <hr/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.notice:hover
  background-color: #ffffff95
.notice
  overflow: auto
  min-height: 300px
  max-height: 300px
  width: 47%
  background-color: #ffffff70
  border-radius: 10px
  padding: 5px
  transition: .5s ease
  .notice_item_box
    width: 98%
    margin: 0 auto
    .notice_item:hover
      background-color: #ffffff50
      cursor: pointer
    .notice_item
      transition: background-color .5s ease
      background-color: #ffffff00
      hr
        border: #57505d 1px dashed
        margin: 0 0 5px
      .notice_item_content_box
        font-size: 14px
        display: flex
        .notice_item_date
          margin: 0 0 0 auto
  .hr
    box-shadow: #57505d50 0 0 5px
  h3
    margin: 0
    padding: 1%
    text-align: center
    color: #57505d
</style>