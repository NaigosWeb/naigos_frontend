<script setup lang="ts">
import {useBARecreateSgthemeStore} from "@/stores/BlueArchive/Recreate/RecreaSgthemeStore";
import {onMounted, ref, watch} from "vue";
import {httpSpring} from "@/utils/http";
import {Close} from "@element-plus/icons-vue";
const baRecreateSgthemeStore = useBARecreateSgthemeStore();

interface SgthemeImpl {
  name: string;
  url: string;
  introduce: string;
  header_image: string | null;
  details_image: string | null;
  cost: number | undefined | null;
  eject_image: string | null;
  theme_id: string;
}

const themeId = ref<string>(baRecreateSgthemeStore.themeId);
const themeDetail = ref<SgthemeImpl | null>(null);
const isVisible = ref<boolean>(true);
const coverElement = ref<HTMLElement | null>(null);

const beforeEnter = (el: HTMLElement) => {
  // 在进入过渡之前，我们可以设置初始样式
  // 但在这个例子中，我们不需要因为已经在CSS中定义了默认样式
  if (coverElement.value) {
    coverElement.value.style.transform = 'translateX(5%)';
    coverElement.value.style.opacity = '0';
  }
};
const enter = (el: HTMLElement, done: () => void) => {
  // 进入过渡开始，我们可以动态地设置样式
  if (coverElement.value) {
    coverElement.value.style.transform = 'translateX(0)';
    coverElement.value.style.opacity = '1';
  }
  // 调用done来指示过渡已完成（如果需要Vue等待过渡结束）
  // 但在这个例子中，我们依赖CSS过渡，所以不需要立即调用done
  // Vue会自动监听transitionend事件来确定何时调用done
  // 然而，由于我们直接设置了样式而不是添加/移除类，Vue不会知道过渡何时结束
  // 因此，我们需要手动调用done或使用setTimeout来模拟过渡时间
  setTimeout(done, 500); // 假设过渡持续时间为300ms
};
const leave = (el: HTMLElement, done: () => void) => {
  // 离开过渡开始，我们可以恢复原始样式
  if (coverElement.value) {
    coverElement.value.style.transform = 'translateX(5%)';
    coverElement.value.style.opacity = '0';
  }
  // 同样地，我们需要手动调用done或使用setTimeout来模拟过渡时间
  setTimeout(done, 500); // 假设过渡持续时间为300ms
};

const fetchThemeDetail = () => {
  httpSpring({
    url: 'api/sgtheme/only',
    method: 'GET',
    headers: {Accept: '*/*'},
    params: {theme_id: themeId.value},
  }).then(res => {
    if (res.status === 200 && res.data?.code === 0) {
      themeDetail.value = res.data?.data;
    }
  }).catch(err => {
    console.error(err);
  })
}

const closeClicked = () => {
  baRecreateSgthemeStore.changeDetailsShow(false, '', '');
}

onMounted(() => {
  fetchThemeDetail();
})
watch(() => baRecreateSgthemeStore.themeId, (newVal: string) => {
  themeId.value = newVal;
  fetchThemeDetail();
})
</script>

<template>
  <transition
      name="cover-transition"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave">
    <div class="container_cover" v-if="isVisible" ref="coverElement">
      <img class="bg" src="@/assets/BlueArchive/Recreate/background.svg" alt="bg"/>
      <header class="cover_header">
        <el-icon @click="closeClicked" class="close_button" size="64"><Close/></el-icon>
        <h2>详情信息</h2>
      </header>
      {{themeDetail}}
    </div>
  </transition>
</template>

<style scoped lang="sass">
.cover-transition-enter-active, .cover-transition-leave-active
  transition: transform .5s ease, opacity .5s ease

.cover-transition-enter, .cover-transition-leave-to
  transform: translateX(5%)
  opacity: 0

.cover-transition-enter-to, .cover-transition-leave
  transform: translateX(0)
  opacity: 1

.container_cover
  width: 100%
  height: 100%
  position: fixed
  top: 0
  background-color: rgba(170, 170, 170, 0.2)
  backdrop-filter: blur(5px)
  z-index: 29
  .cover_header
    width: 100%
    height: 70px
    display: flex
    align-items: center
    h2
      margin-left: 20px
    .close_button
      transition: .3s ease
    .close_button:hover
      transform: rotate(45deg)
      cursor: pointer
  .bg
    position: absolute
    right: 0
    bottom: 0
    height: 100%
    opacity: .5
    z-index: -1
</style>