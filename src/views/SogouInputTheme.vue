<script setup lang="ts">
import TopHeader from "@/components/HeaderFooter/TopHeader.vue";
import {onMounted, ref} from "vue";
import {httpSpring} from "@/utils/http";

const sgthemeClassify = ref();

onMounted(() => {
  httpSpring({
    url: "api/sgtheme/classify/brief",
    method: "GET"
  }).then(res => {
    if (res.data.code === 0){
      console.log(res.data);
      sgthemeClassify.value = res.data.data;
    }
  }).catch(err => {
    console.error(err);
  })
})
</script>

<template>
  <TopHeader/>
  <img class="banner" src="@/assets/SogouInputThemeView/banner.jpg" alt="banner"/>
  <div class="container">

  </div>
</template>

<style scoped lang="sass">
.banner
  width: 100vw
  box-shadow: #e0bca370 0 10px 10px
.container
  height: 300px
</style>