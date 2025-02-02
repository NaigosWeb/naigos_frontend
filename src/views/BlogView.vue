<script setup lang="ts">

import BlogHeaderComp from "@/components/Blog/BlogHeaderComp.vue";
import BlogBgComp from "@/components/Blog/BlogBgComp.vue";
</script>

<template>
  <BlogBgComp/>
  <BlogHeaderComp/>
  <RouterView/>
</template>

<style scoped lang="sass">

</style>