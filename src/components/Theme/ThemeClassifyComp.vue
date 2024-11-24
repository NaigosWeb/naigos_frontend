<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {ThemeClassifyBriefImpl} from "@/interfaces/ThemeImpl";
import {httpSpring} from "@/utils/http";
import {showMessageNotific} from "@/utils/MsgNotific";
import {useRouter} from "vue-router";
const router = useRouter();

const themeClassifyList = ref<ThemeClassifyBriefImpl[] | null>(null);

const itemClicked = (routerName: string) => {
  router.push(`/theme/${routerName}`);
}

onMounted(() => {
  httpSpring({
    url: 'api/theme/classify/all_classify_brief',
    method: 'GET'
  }).then(res => {
    if (res?.data?.code === 0) {
      themeClassifyList.value = res?.data?.data;
    } else {
      showMessageNotific('red', res?.data?.message);
    }
  }).catch(err => {
    console.error(err);
    showMessageNotific('red', '网络异常！');
  })
})
</script>

<template>
  <div class="item_box" v-if="themeClassifyList">
    <div class="item" v-for="(item, index) in themeClassifyList" :key="index" @click="itemClicked(item.classify_id)">
      <img class="cover_image" :src="item.cover_image || ''" alt="cover_img"/>
    </div>
  </div>
  <div class="item_box" v-else>无内容</div>
</template>

<style scoped lang="sass">
.item_box
  width: 90%
  margin: 50px auto 0 auto
  display: flex
  .item:hover
    transform: translateY(-10px)
    box-shadow: #5e5ca6 0 0 10px
    cursor: pointer
  .item
    border-radius: 10px
    width: 300px
    height: 400px
    //border: #57505d solid 1px
    background-color: #f0d4eb50
    overflow: hidden
    transition: .3s ease
    .cover_image
      width: 100%
</style>