<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
import defaultAvatar from "@/assets/Main/avatar.jpg";
import {httpSpring} from "@/utils/http";
import {showMessageNotice} from "@/utils/MsgNotific";

const permiButtonList: Array<{title: string, permission: number}> = [
  {title: '用户', permission: 1},
  {title: '创作者', permission: 1 << 1},
  {title: '开发者', permission: 1 << 2},
  {title: '管理者', permission: 1 << 3},
  {title: '创始者', permission: 1 << 4},
]

const userList = ref<UserArchiveImpl[] | null>(null);
const radioOption = ref<string>('');
const searchInput = ref<string>('');
const searchedList = ref<UserArchiveImpl[]>([]);
const dialogVisible = ref<boolean>(false);
const userArchive = ref<UserArchiveImpl | null>(null);
const changeUserPermission = ref<number>(0);

const userClicked = (uuid: string) => {
  dialogVisible.value = true;
  if (userList.value == null) return;
  for (let i = 0; i < userList.value.length; i++) {
    if (userList.value[i].group_real_user_id === uuid){
      userArchive.value = userList.value[i];
      break;
    }
  }
}
const editUserArchiveChecked = () => {
  if (userArchive.value == null) return;
  console.log(userArchive.value);
  httpSpring({
    url: 'api/manage/user/edit',
    method: 'PUT',
    headers: {
      Authorization: window.localStorage.getItem('token'),
      'Content-Type': 'application/json'
    },
    data: userArchive.value
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotice('green', res?.data?.data);
    } else {
      showMessageNotice('red', res?.data?.message);
    }
  }).catch(err => {
    console.log(err);
    showMessageNotice('red', '未知错误！')
  })
}
const userPermissionSelect = (permission: number) => {
  if ((changeUserPermission.value & permission) !== 0){
    changeUserPermission.value -= permission;
    console.log('存在', permission, '计算结果', changeUserPermission.value);
  } else {
    changeUserPermission.value += permission;
    console.log('不存在', permission, '计算结果', changeUserPermission.value);
  }
}
const userPermissionChecked = () => {
  if (changeUserPermission.value === 0){
    showMessageNotice('red', '权限集合至少是用户！');
    return;
  }
  httpSpring({
    url: 'api/manage/user/change_permi',
    method: "POST",
    headers: {
      Authorization: window.localStorage.getItem('token'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      modified_uuid: userArchive?.value?.group_real_user_id || '',
      permission: changeUserPermission.value
    }
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotice('green', res?.data?.data);
    } else {
      showMessageNotice('red', res?.data?.message);
    }
  }).catch(err => {
    showMessageNotice('red', '未知错误！');
    console.error(err);
  })
}

const searchClicked = () => {
  console.log(searchInput.value);
  console.log(radioOption.value);
  if (userList.value == null) return;
  searchedList.value = [];
  switch (radioOption.value){
    case 'nickname': {
      for (let i = 0; i < userList.value.length; i++){
        if (userList.value[i].nickname.includes(searchInput.value)){
          searchedList.value.push(userList.value[i]);
        }
      }
      break;
    } case 'qq': {
      for (let i = 0; i < userList.value.length; i++){
        if (String(userList.value[i].qq_id).includes(searchInput.value)){
          searchedList.value.push(userList.value[i]);
        }
      }
      break;
    } case 'email': {
      for (let i = 0; i < userList.value.length; i++){
        if (userList.value[i].email.includes(searchInput.value)){
          searchedList.value.push(userList.value[i]);
        }
      }
      break;
    } default: break;
  }
}

const resetClicked = () => {
  searchInput.value = '';
  searchedList.value = [];
  if (userList.value){
    searchedList.value = userList.value;
  }
}

onMounted(() => {
  httpSpring({
    url: 'api/manage/user/all',
    method: "GET",
    headers: {Authorization: window.localStorage.getItem("token")}
  }).then(res => {
    if (res?.data?.code === 0) {
      userList.value = res?.data?.data;
      searchedList.value = res?.data?.data;
    }
  }).catch(err => {
    console.error(err);
  })
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="用户管理" width="600" class="dialog_box">
    <hr/>
    <div v-if="userArchive != null">
      <el-form label-width="auto" :model="userArchive" @submit.prevent="editUserArchiveChecked">
        <el-form-item label="昵称：">
          <el-input type="text" v-model="userArchive.nickname"/>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="userArchive.email"/>
        </el-form-item>
        <el-form-item label="QQ：">
          <el-input v-model="userArchive.qq_id"/>
        </el-form-item>
        <el-button native-type="submit" type="primary">确认修改</el-button>
        <el-button native-type="button" type="text" @click="dialogVisible = false">关闭</el-button>
      </el-form>
      <hr/>
      <div style="display: flex; align-items: center;">
        <span>修改权限：</span>
        <label style="margin-right: 10px" v-for="(item, index) in permiButtonList" :key="index">
          <input :value="item.permission" type="checkbox" name="permission_type" @click="userPermissionSelect(item.permission)"/>{{item.title}}
        </label>
        <el-button type="primary" native-type="button" @click="userPermissionChecked">确认修改</el-button>
      </div>
    </div>
    <div v-else>
      未知用户
    </div>
  </el-dialog>
  <div class="manage_user_box">
    <div class="title">
      <p>全部用户列表</p>
      <form class="search_bar" @submit.prevent="searchClicked">
        <input class="input_text" type="text" placeholder="请输入" required v-model="searchInput"/>
        <label>
          <input class="radios" type="radio" v-model="radioOption" value="nickname"/>昵称
        </label>
        <label>
          <input class="radios" type="radio" v-model="radioOption" value="qq"/>QQ
        </label>
        <label>
          <input class="radios" type="radio" v-model="radioOption" value="email"/>邮箱
        </label>
        <button class="button" type="submit">搜索</button>
        <button class="button" type="button" @click="resetClicked">重置</button>
      </form>
    </div>
    <div class="user_item_box" v-if="userList">
      <div class="user_item" v-for="(item, index) in searchedList" :key="index" @click="userClicked(item?.group_real_user_id || '')">
        <div class="avatar_and_nickname_and_id">
          <div class="nickname_and_id">
            <div class="nickname">{{item.nickname}}</div>
            <div class="id">#{{item.id}}</div>
          </div>
          <img :src="item.avatar || defaultAvatar" alt="avatar"/>
        </div>
        <div class="qq_id">QQ：{{item.qq_id}}</div>
        <div class="email">邮箱：{{item.email}}</div>
      </div>
    </div>
    <div class="user_item_box no" v-else>
      <p>无数据</p>
    </div>
  </div>
</template>

<style scoped lang="sass">
.manage_user_box
  flex: 1
  max-width: 100%
  .title
    width: 100%
    height: 60px
    background-color: #5d505b
    display: flex
    align-items: center
    color: white
    p
      font-weight: bold
      margin-left: 2%
      font-size: 20px
    .search_bar
      margin: 0 auto
      .input_text
        height: 25px
        width: 280px
        background-color: #ffffff80
        border: white 1px solid
        border-radius: 5px
      .input_text::placeholder
        color: white
      .button
        background-color: #ffffff50
        border: #fff 1px solid
        border-radius: 5px
        color: white
        width: 120px
        height: 30px
        font-size: 16px
        transition: .3s ease
        margin-left: 10px
      .button:hover
        background-color: #ffffff80
        cursor: pointer
      .radios
        margin: 0 5px 0 5px
  .user_item_box
    overflow: auto
    max-height: calc(100vh - 160px)
    display: flex
    flex-wrap: wrap
    gap: 20px
    padding: 20px
    .user_item:hover
      cursor: pointer
      transform: translateY(-5px)
      box-shadow: #f0d4eb 0 0 10px
    .user_item
      background-color: #f0d4eb40
      transition: .3s ease
      width: 280px
      height: 120px
      border: #f0d4eb 1px solid
      position: relative
      overflow: hidden
      border-radius: 10px
      padding: 5px
      .qq_id
        color: #57505d
      .email
        color: #57505d
        font-size: 14px
      .avatar_and_nickname_and_id
        display: flex
        justify-content: right
        width: 100%
        img
          border-radius: 50%
          width: 64px
          height: 64px
          border: #f0d4eb 2px solid
          box-shadow: #f0d4eb 0 0 5px
        .nickname_and_id
          flex: 1
          color: #666
          .nickname
            font-size: 16px
            font-weight: bold
          .id
            font-size: 14px
</style>