<script setup lang="ts">
import NMNoticeComp from "@/components/Home/NoticeMessage/NMNoticeComp.vue";
import NMMessageComp from "@/components/Home/NoticeMessage/NMMessageComp.vue";
</script>

<template>
  <div class="notice_message_box">
    <NMNoticeComp/>
    <NMMessageComp/>
  </div>
</template>

<style scoped lang="sass">
@keyframes notice_message_box_in
  0%
    opacity: 0
    transform: translateY(20px)
  100%
    opacity: 1
    transform: translateY(0)
@mixin notice_message_box_in_ani()
  animation: notice_message_box_in
  animation-duration: .8s
  animation-fill-mode: forwards
  animation-delay: .8s
.notice_message_box
  display: flex
  justify-content: space-between
  opacity: 0
  transform: translateY(20px)
  margin-bottom: 30px
  @include notice_message_box_in_ani()
</style>