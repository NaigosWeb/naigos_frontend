<script setup lang="ts">
import {onMounted, ref} from "vue";
import {httpSpring} from "@/utils/http";
import type {ThemeBriefImpl} from "@/interfaces/ThemeImpl";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";

const itemList = ref<Array<ThemeBriefImpl> | null>(null);
const dialogVisible = ref(false)
const dialogForm = ref<ThemeBriefImpl | null>(null);

const itemClicked = (theme: ThemeBriefImpl) => {
  dialogVisible.value = true;
  dialogForm.value = theme;
}

const delectButtonClicked = () => {
  if (dialogForm.value === null) {
    showExceptionNotice();
    return;
  }
  httpSpring({
    url: 'api/theme/delete',
    method: 'DELETE',
    headers: {Authorization: window.localStorage.getItem('token')},
    params: {theme_id: dialogForm.value.theme_id}
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotice('green', res?.data?.data);
      fetchAllMeThemeBrief();
      dialogVisible.value = false;
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();})
}
function fetchAllMeThemeBrief () {
  httpSpring({
    url: 'api/theme/me_all_brief',
    method: 'GET',
    headers: {Authorization: window.localStorage.getItem('token')}
  }).then(res => {
    if (res?.data?.code === 0) {
      itemList.value = res?.data?.data;
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {
    showExceptionNotice();
  })
}
onMounted(() => {
  fetchAllMeThemeBrief();
})
</script>

<template>
  <el-dialog class="dialog_box" v-model="dialogVisible">
    <h3>是否删除该作品？</h3>
    <hr/>
    <div v-if="dialogForm" class="dialog_form_box">
      <ul>
        <li>作品名：{{dialogForm.name}}</li>
        <li>作品编号：{{dialogForm.theme_id}}</li>
        <li v-if="dialogForm.header_image">
          <img :src="dialogForm.header_image" alt="cover_img"/>
        </li>
        <el-button @click="delectButtonClicked" native-type="button" type="danger">确认删除</el-button>
      </ul>
    </div>
  </el-dialog>
  <div class="delete_box">
    <h4>删除您的作品</h4>
    <div v-if="itemList && itemList.length > 0" class="item_box">
      <div class="item" v-for="(item) in itemList" :key="item.theme_id" @click="itemClicked(item)">
        <img v-if="item.header_image" class="cover_image" :src="item?.header_image || ''" alt="cover_img"/>
        <div v-else>
          <p>{{item.name}}</p>
          <p>{{item.theme_id}}</p>
        </div>
      </div>
    </div>
    <div v-else class="item_box">
      <p class="item_no">您没有收录在奶果小站的作品</p>
    </div>
  </div>
</template>

<style scoped lang="sass">
.dialog_box
  h3
    margin-top: 0
  .dialog_form_box
    ul
      margin: 0
      li
        margin-bottom: 16px
.delete_box
  flex: 1
  border: #f0d4eb 1px solid
  border-radius: 10px
  padding: 20px
  max-height: calc(100vh - 500px)
  overflow: auto
  h4
    text-align: center
  .item_box
    display: flex
    gap: 20px
    flex-wrap: wrap
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
    .item_no
      text-align: center
</style>