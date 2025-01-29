<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {todayDate, todayWeek} from "@/utils/TodayCN";
import {httpSpring} from "@/utils/http";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";
import {
  timestampToTimeByDate,
  timestampToTimeByTimeNoSecond
} from "@/utils/TimestampToTime";

const clock = ref<string | null>(null);
const today = ref<{today: string; week: string}>({today: '', week: ''});
const serverTimestamp = ref<number | null>(null);
const isServerTimeChange = ref<boolean>(false);

const fetchServerTime = () => {
  httpSpring({
    url: 'api/sundry/get_server_time',
    method: 'GET',
  }).then(res => {
    if (res?.data?.code === 0) {
      serverTimestamp.value = res?.data?.data;
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();})
}

let timer: number, timerServerGetter: number;
fetchServerTime();
const initClock = () => {
  timer = setInterval(() => {
    const date = new Date();
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    clock.value = hours + ":" + minutes + ":" + seconds;
  }, 1000);
  today.value.today = todayDate();
  today.value.week = todayWeek();
  timerServerGetter = setInterval(() => {
    fetchServerTime();
  }, 30000);
}

onMounted(() => {
  initClock();
})
onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(timerServerGetter);
  clearTimeout(timeoutServerChange);
})
let timeoutServerChange: number;
watch(() => isServerTimeChange.value, () => {
  if (isServerTimeChange.value) {
    timeoutServerChange = setTimeout(() => {
      isServerTimeChange.value = false;
    }, 5000);
  } else {
    clearTimeout(timeoutServerChange);
  }
})
</script>

<template>
  <div class="blog_date_box">
    <p class="blog_date_clock">{{clock}}</p>
    <p class="blog_date_today">{{today.today}}</p>
    <p class="blog_date_week">{{today.week}}</p>
  </div>
  <div class="blog_date_box blog_date_box_server_time" @click="isServerTimeChange = !isServerTimeChange">
    <p>服务器时间</p>
    <p class="blog_date_clock" v-if="!isServerTimeChange">{{timestampToTimeByTimeNoSecond(serverTimestamp || 0)}}</p>
    <p class="blog_date_today" v-if="!isServerTimeChange">{{timestampToTimeByDate(serverTimestamp || 0)}}</p>
    <p class="blog_date_today" v-else>UTC+8 China: Asia/Shanghai</p>
    <p class="blog_date_today" v-if="isServerTimeChange">服务器位置：中国</p>
  </div>
</template>

<style scoped lang="css">
.blog_date_box_server_time:hover{
  cursor: pointer;
  background-color: #ffffff80;
}
.blog_date_box_server_time{
  transition: background-color .3s ease;
}
.blog_date_box:first-child{
  margin-bottom: 10px;
}
.blog_date_box {
  padding: 10px;
  background-color: #ffffff30;
  border-radius: 20px;
  border: #ffffff50 solid 3px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  p {
    margin: 0;
    color: #ffffff;
  }
  .blog_date_clock{
    font-size: 32px;
    font-weight: bold;
  }
  .blog_date_today, .blog_date_week{
    font-size: 20px;
    font-weight: bold;
  }
}
</style>