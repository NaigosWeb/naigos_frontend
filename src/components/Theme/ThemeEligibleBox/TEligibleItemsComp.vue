<script setup lang="ts">
import {onMounted, ref} from "vue";
import {httpSpring} from "@/utils/http";
import type {ThemeBriefImpl} from "@/interfaces/ThemeImpl";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";
import {useRoute, useRouter} from "vue-router";
const route = useRoute();
const router = useRouter();

const themeBriefList = ref<ThemeBriefImpl[] | null>(null);

const itemClicked = (themeId: string) => {
  router.push({name: 'ThemeEligibleOnly', params: {theme_id: themeId}})
}

onMounted(() => {
  const routerName: string = route.params.classify_id as string;
  httpSpring({
    url: 'api/theme/all_eligible_brief',
    method: 'GET',
    params: {classify_id: routerName}
  }).then(res => {
    if (res?.data?.code === 0) {
      themeBriefList.value = res?.data?.data;
      console.log(themeBriefList.value);
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
  <div class="item_box" v-if="themeBriefList && themeBriefList.length > 0">
    <div class="item" v-for="(item, index) in themeBriefList" :key="index" @click="itemClicked(item.theme_id)">
      <img class="cover_image" :src="item?.header_image || ''" alt="cover_img"/>
    </div>
  </div>
  <div class="item_box" v-else>无结果</div>
</template>

<style scoped lang="sass">
.item_box
  padding: 50px
  display: flex
  gap: 20px
  .item:hover
    transform: skew(-10deg) translateY(-5%)
    cursor: pointer
  .item
    transform: skew(-10deg)
    border-radius: 10px
    border: white 5px solid
    box-shadow: #57505d50 5px 5px
    width: 250px
    height: 130px
    transform-origin: center
    transition: .3s ease
    position: relative
    overflow: hidden
    .cover_image
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%) skew(10deg)
      width: 110%
      height: 110%
</style>