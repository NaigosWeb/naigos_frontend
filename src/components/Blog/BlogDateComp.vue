<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {todayDate, todayWeek} from "@/utils/TodayCN";

const clock = ref<string | null>(null);
const today = ref<{today: string; week: string}>({today: '', week: ''});

let timer: number;

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
}

onMounted(() => {
  initClock();
})
onBeforeUnmount(() => {
  clearInterval(timer);
})
</script>

<template>
  <div class="blog_date_box">
    <p class="blog_date_clock">{{clock}}</p>
    <p class="blog_date_today">{{today.today}}</p>
    <p class="blog_date_week">{{today.week}}</p>
  </div>
</template>

<style scoped lang="css">
.blog_date_box {
  height: 120px;
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