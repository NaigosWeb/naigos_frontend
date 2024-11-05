<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {NaigosNoticeImpl} from "@/interfaces/NaigosNoticeImpl";
import {httpSpring} from "@/utils/http";
import {timestampToTime} from "@/utils/TimestampToTime";

const noticeList = ref<NaigosNoticeImpl[]>([]);

const fetchAllNotice = () => {
  httpSpring({
    url: 'api/notice/all',
    method: "GET",
  }).then(res => {
    if (res.data.code === 0){
      const list: NaigosNoticeImpl[] = res.data?.data;
      if (list.length > 9){
        for (let i = 0; i < 9; i++){
          noticeList.value.push(list[i]);
        }
      } else {
        noticeList.value = list;
      }
    }
  }).catch(err => {
    console.error(err);
  })
}

onMounted(() => {
  fetchAllNotice();
})
</script>

<template>
  <div class="notice">
    <h3>公告</h3>
    <hr class="hr"/>
    <div class="notice_item_box">
      <div class="notice_item" v-for="(item, index) in noticeList" :key="index" :title="item?.content">
        <div class="notice_item_content_box">
          <span class="notice_item_title">{{item?.title}}</span>
          <span class="notice_item_date">{{timestampToTime(item?.last_date)}}</span>
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