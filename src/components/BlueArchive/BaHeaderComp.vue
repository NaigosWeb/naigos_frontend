<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useTransfromBgvStatus} from "@/stores/BlueArchive/TransfromBgvStatus";
const transfromStatus = useTransfromBgvStatus();
import {useRouter} from "vue-router";
const router = useRouter();

const itemList = ref([
  {title: '二创', url: '#'},
  {title: '收录', url: '#'},
  {title: '反馈', url: '#'},
  {title: '返回', url: '#'},
]);

function itemClick(index: number) {
  switch (index) {
    case 0: router.push('/blue_archive/re-creation'); break;
    case 1: router.push('/blue_archive/record'); break;
    case 2: router.push('/blue_archive/t2'); break;
    case 3: {
      transfromStatus.changeTransfromStatus();
      setTimeout(() => {
        transfromStatus.changeTransfromStatus();
      }, 2000)
      break;
    } default: break;
  }
}

// watch([
//   () => transfromStatus.isTransfromStatus,
//   () => transfromStatus.isMainBgvStatus
// ], ([newTranfromStatus, newMainBgvStatus], [oldTranfromStatus, oldMainBgvStatus]) => {
//   console.log('T:', 'nt', newTranfromStatus, 'ot', oldTranfromStatus);
//   console.log('M:', 'nm', newMainBgvStatus, 'om', oldMainBgvStatus);
// })

</script>

<template>
  <header>
    <img class="logo" src="@/assets/BlueArchive/logo_2.e1693a80.png" alt="logo"/>
    <div class="item_box">
      <span @click="itemClick(index)" v-for="(item, index) in itemList" :key="index">{{item.title}}</span>
    </div>
  </header>
</template>

<style scoped lang="sass">
header
  height: 8rem
  width: 100%
  position: relative
  display: flex
  align-items: center
  .logo
    height: 90%
    position: absolute
    left: 4%
    bottom: -20%
  .item_box
    position: absolute
    right: 15%
    span
      margin-right: 60px
      font-size: 1.2rem
      letter-spacing: 3px
      font-weight: bold
      color: #666
      font-family: FZLanTYJW_Cu,sans-serif
    span:last-child
      margin-right: 0
</style>