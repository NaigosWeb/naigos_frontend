<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {httpSpring} from "@/utils/http";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";
import type {ThemeImpl} from "@/interfaces/ThemeImpl";
const route = useRoute();
const router = useRouter();

const themeDetails = ref<ThemeImpl | null>(null);
const uploaderName = ref<string | null>(null);

const downloadClicked = (url: string) => {window.location.href = url;}
const fetchUploaderNickname = async (uuid: string) => {
  await httpSpring({
    url: 'users/other/nickname',
    method: 'GET',
    params: {uuid}
  }).then(res => {
    if (res?.data?.code === 0) uploaderName.value = res.data.data;
    else uploaderName.value = "未知";
  }).catch(() => {
    uploaderName.value = "未知";
  })
}

onMounted(() => {
  httpSpring({
    url: 'api/theme/only',
    method: 'GET',
    params: {theme_id: route.params.theme_id as string | null}
  }).then(res => {
    if (res?.data?.code === 0) {
      themeDetails.value = res?.data?.data;
      if (themeDetails.value && themeDetails.value.author) fetchUploaderNickname(themeDetails.value.author);
    } else {
      showMessageNotice('red', res?.data?.message);
    }
  }).catch(err => {
    console.error(err);
    showExceptionNotice();
  })
})
</script>

<template>
  <div class="theme_container" v-if="themeDetails">
    <h2>{{themeDetails.name}}</h2>
    <div class="author_and_download">
      <p>上传者：{{uploaderName || ''}}</p>
      <button v-if="themeDetails.url" @click="downloadClicked(themeDetails.url)">点击下载</button>
    </div>
    <p>{{themeDetails.introduce}}</p>
    <div class="theme_details_image_box" v-if="themeDetails.detail_html">
      <div v-html="themeDetails.detail_html"></div>
<!--      <img v-for="(item, index) in themeDetails.detail_html.split('[next]')" :key="index" :src="item" alt="item_img"/>-->
    </div>
  </div>
</template>

<style scoped lang="sass">
.theme_container
  text-align: center
</style>