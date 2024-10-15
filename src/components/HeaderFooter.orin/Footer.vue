<script setup lang="ts">

</script>

<template>
  <footer class="footer_box">
    <a class="beian" href="https://beian.miit.gov.cn/">黑ICP备2022001036号-2</a>
    <p class="copyright-mark">Copyright ©2024 by 夜战笨蛋Yasenbaka</p>
<!--    All Rights Reserved.-->
  </footer>
</template>

<style scoped lang="sass">
.footer_box
  position: relative
  width: 100%
  height: 40px
  background-color: #33354c
  .beian
    position: absolute
    top: 5%
    left: 50%
    transform: translateX(-50%)
    text-decoration: none
  .copyright-mark
    position: absolute
    left: 50%
    top: 20%
    transform: translate(-50%)
  .copyright-mark, .beian
    color: white
    font-size: 12px
</style>