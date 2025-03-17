<script setup lang="ts">
import {ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import {httpSpring} from "@/utils/http";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";
const userDetailStore = useUserDetailStore();
import {useRouter} from "vue-router";
import type {UserExchangeUuidImpl} from "@/interfaces/UserExchangeUuidImpl";
const router = useRouter();

const userArchive = ref<UserArchiveImpl>({
  id: userDetailStore.userDetails.id,
  qq_id: userDetailStore.userDetails.qq_id,
  nickname: userDetailStore.userDetails.nickname,
  group_real_user_id: userDetailStore.userDetails.group_real_user_id,
  register_real_group_id: userDetailStore.userDetails.register_real_group_id,
  city: userDetailStore.userDetails.city,
  score: userDetailStore.userDetails.score,
  avatar: userDetailStore.userDetails.avatar,
  favorite: userDetailStore.userDetails.favorite,
  email: userDetailStore.userDetails.email,
  safe_level: userDetailStore.userDetails.safe_level,
  is_bot_memory: userDetailStore.userDetails.is_bot_memory
})
const userExchangeCode = ref<string | null>(null);
const isExchangeShow = ref<boolean>(false);

const bindingClicked = () => {
  isExchangeShow.value = true;
  httpSpring({
    url: 'bot/binding/get_code',
    method: 'GET',
    headers: {Authorization: window.localStorage.getItem('token')}
  }).then(res => {
    if (res?.data?.code === 0) {
      userExchangeCode.value = res?.data?.data;
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

const copyToClipboard = (target: string | null) => {
  if (target) {
    navigator.clipboard.writeText(target).then(() => {
      showMessageNotice('green', '已复制到剪切板！Copied to clipboard!');
    }).catch(() => {showMessageNotice('red', '无法复制到剪切板！Can not copied to clipboard!');});
  } else showMessageNotice('red', '无法复制空内容，貌似出错！');
}

const editClicked = () => {
  console.log(userArchive.value);
  httpSpring({
    url: 'users/edit_archive/web',
    method: 'PUT',
    headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
    data: userArchive.value,
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotice('teal', res?.data?.data);
      userDetailStore.fetchUserArchive();
      router.back();
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {
    showMessageNotice('red', '请求异常！请检查网络！');
  })
}
const exitEditClicked = () => {
  router.back();
}
const editRouterClicked = (routerName: string) => {
  router.replace({name: routerName});
}

watch(() => userDetailStore.userDetails, (newVal: UserArchiveImpl) => {
  userArchive.value = {...newVal};
})
</script>

<template>
  <div class="edit_archive_box">
    <el-form label-width="auto" :model="userArchive" style="width: 800px;" @submit.prevent="editClicked">
      <el-form-item label="昵称：">
        <el-input type="text" v-model="userArchive.nickname"/>
      </el-form-item>
      <el-form-item label="电子邮箱：">
        <el-input type="text" v-model="userArchive.email"/>
      </el-form-item>
      <el-form-item label="QQ号：">
        <el-input title="一年只能修改一次" type="text" v-model="userArchive.qq_id"/>
        一年只能修改一次！
      </el-form-item>
      <el-form-item label="所在地：">
        <el-input type="text" v-model="userArchive.city"/>
        任意国、省、市、区县镇或外国、州、府、道、区，也可精确全写。
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认修改</el-button>
        <el-button type="warning" native-type="button" @click="exitEditClicked">取消修改</el-button>
        <el-button type="success" native-type="button" @click="editRouterClicked('PersonalCenterEditAvatar')">修改头像</el-button>
        <el-button type="success" native-type="button" @click="editRouterClicked('PersonalCenterEditPassword')">修改密码</el-button>
        <el-button v-if="!userArchive.is_bot_memory" type="danger" native-type="button" title="仅供网页注册用户" @click="bindingClicked">绑定群BOT</el-button>
      </el-form-item>
    </el-form>
    <div class="edit_archive_binding_bot" v-if="isExchangeShow">
      <h3>绑定群Bot验证码：（点击框复制）<el-button type="info" native-type="button" @click="copyToClipboard(userExchangeCode || null)" v-if="userExchangeCode">
        {{ userExchangeCode }}</el-button></h3>
      <p>请在群中@奶果酱 /站群绑定验证 验证码，待奶果酱回复您成功，则证明已经完成验证，无需再管本框。</p>
      <p>Q：为什么需要绑定？</p>
      <p>A：因为QQBot接入官方获取的腾讯UUID，而你的档案是在网站注册获取的奶果UUID，两个UUID并不互通，需要您手动绑定。</p>
      <p>A注：QQBot注册获取的UUID兼容[奶果Bot/奶果网站/喵羽网站]，网站注册获取的UUID则无法支持[奶果Bot]。</p>
    </div>
  </div>
</template>

<style scoped lang="sass">
.edit_archive_box
  color: #666
</style>