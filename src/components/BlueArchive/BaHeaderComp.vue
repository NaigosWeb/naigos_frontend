<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useTransfromStatus} from "@/stores/BlueArchive/TransfromStatus";
const transfromStatus = useTransfromStatus();
import {useRouter} from "vue-router";
const router = useRouter();

const itemList = ref([
  {title: '美化', url: '#'},
  {title: '收录', url: '#'},
  {title: '二创', url: '#'},
  {title: '反馈', url: '#'},
  {title: '转场', url: '#'},
]);

function itemClick(index: number) {
  if (index === 4){
    transfromStatus.changeTransfromStatus();
    setTimeout(() => {
      transfromStatus.changeTransfromStatus();
    }, 2000)
  } else if (index === 1){
    router.push('/ba/t1');
  }
}


</script>

<template>
  <header>
    <img class="logo" src="@/assets/BlueArchive/LOGO.4a06cdd2.png" alt="logo"/>
    <div class="item_box">
      <span @click="itemClick(index)" v-for="(item, index) in itemList" :key="index">{{item.title}}</span>
    </div>
  </header>
</template>

<style scoped lang="sass">
header
  height: 6rem
  width: 100vw
  position: relative
  display: flex
  align-items: center
  .logo
    height: 90%
    position: absolute
    left: 5%
  .item_box
    position: absolute
    right: 5%
    span
      margin-right: 30px
      font-size: .6rem
      font-family: FZLanTYJW_Cu,sans-serif
    span:last-child
      margin-right: 0
</style>