<script setup lang="ts">
import {useRouter} from "vue-router";
const router = useRouter();
import frontendItem from "@/assets/Apply/frontend_item.jpg";
import springItem from "@/assets/Apply/spring_item.jpg";
import djangoItem from "@/assets/Apply/django_item.jpg";
import javaItem from "@/assets/Apply/java_item.jpg";
import pythonItem from "@/assets/Apply/python_item.jpg";
import mysqlItem from "@/assets/Apply/mysql_item.jpg";
import redisItem from "@/assets/Apply/redis_item.jpg";
import linuxItem from "@/assets/Apply/linux_item.jpg";

interface itemImpl {
  title: string;
  routerName: string;
  imgUrl?: any | null;
}

const itemList: itemImpl[] = [
  {title: '前端', routerName: 'ApplyFrontend', imgUrl: frontendItem},
  {title: 'Spring系列', routerName: 'spring', imgUrl: springItem},
  {title: 'Django系列', routerName: 'django', imgUrl: djangoItem},
  {title: 'Java基础', routerName: 'java', imgUrl: javaItem},
  {title: 'Python基础', routerName: 'python', imgUrl: pythonItem},
  {title: 'MySQL数据库基础', routerName: 'mysql', imgUrl: mysqlItem},
  {title: 'Redis基础', routerName: 'redis', imgUrl: redisItem},
  {title: 'Linux基础', routerName: 'linux', imgUrl: linuxItem},
]

const itemClicked = (routerTarget: string) => {
  router.push({name: routerTarget});
}
</script>

<template>
  <h3>奶果笔记中的学习资料</h3>
  <hr/>
  <div class="item_box">
    <div class="item" v-for="(item, index) in itemList" :key="index" @click="itemClicked(item.routerName)">
      <img :src="item.imgUrl" alt="item"/>
    </div>
  </div>
</template>

<style scoped lang="sass">
@keyframes item_box_in
  0%
    opacity: 0
    transform: translateY(-20px)
  100%
    opacity: 1
    transform: translateY(0)
@mixin item_box_in_ani()
  animation: item_box_in
  animation-duration: .8s
  animation-delay: .5s
  animation-fill-mode: forwards
h3
  text-align: center
  font-family: BAFJ_CU, sans-serif
  color: #57505d
  font-size: 24px
hr
  margin: 0 auto
  padding: 0
  width: 1600px
.item_box
  @include item_box_in_ani()
  opacity: 0
  width: 1600px
  margin: 50px auto 0 auto
  display: flex
  gap: 40px
  flex-wrap: wrap
  .item
    width: 280px
    height: 130px
    border-radius: 20px
    overflow: hidden
    opacity: .9
    transition: .3s ease
    position: relative
    img
      position: absolute
      width: 100%
      height: 100%
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      transition: .3s ease
    img:hover
      width: calc(100% * 1.05)
      height: calc(100% * 1.05)
  .item:hover
    opacity: 1
    box-shadow: #57505d80 0 0 15px
    transform: translateY(-5px)
</style>