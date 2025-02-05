<script setup lang="ts">
import BlogHeaderComp from "@/components/Blog/BlogHeaderComp.vue";
import BlogBgComp from "@/components/Blog/BlogBgComp.vue";
import {nextTick, ref, watch} from "vue";
import BlogContentComp from "@/components/Blog/BlogContent/BlogContentComp.vue";
import {useBlogContentStore} from "@/stores/Blog/BlogContentStore";
const blogContentStore = useBlogContentStore();

const isBlogContentViewShow = ref<boolean>(blogContentStore.isContentViewShow);

function blogContentBeforeEnter(el: any) {
  el.style.opacity = 0;
  el.style.left = '60%';
}
function blogContentEnter(el: any, done: any) {
  // 这里我们使用nextTick来确保DOM更新完成后再进行动画
  nextTick(() => {
    el.offsetWidth; // 触发重排
    el.style.transition = 'opacity 0.5s, left 0.5s';
    el.style.opacity = 1;
    el.style.left = '50%';
    done();
  });
}

function blogContentBeforeLeave(el: any) {
  el.style.transition = 'opacity 0.5s, left 0.5s';
  el.style.opacity = 0;
  el.style.left = '60%';
}

watch(() => blogContentStore.isContentViewShow, (newVal: boolean) => {
  isBlogContentViewShow.value = newVal;
})
</script>

<template>
  <Transition @before-enter="blogContentBeforeEnter" @enter="blogContentEnter" @before-leave="blogContentBeforeLeave">
    <BlogContentComp v-if="isBlogContentViewShow"/>
  </Transition>
  <BlogBgComp/>
  <BlogHeaderComp/>
  <RouterView/>
</template>

<style scoped lang="sass">

</style>