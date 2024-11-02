<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
import defaultAvatar from "@/assets/Main/avatar.jpg";
import {httpSpring} from "@/utils/http";

const userList = ref<UserArchiveImpl[] | null>(null);

onMounted(() => {
  httpSpring({
    url: 'api/manage/user/all',
    method: "GET",
    headers: {Authorization: window.localStorage.getItem("token")}
  }).then(res => {
    if (res?.data?.code === 0) {
      userList.value = res?.data?.data;
    }
  }).catch(err => {
    console.error(err);
  })
})
</script>

<template>
  <div class="manage_user_box">
    <div class="title">
      <p>全部用户列表</p>
      <div class="search_bar">
        <input class="input_text" type="text" placeholder="请输入"/>
        <label>
          <input class="radios" type="radio" name="select_user"/>昵称
        </label>
        <label>
          <input class="radios" type="radio" name="select_user"/>QQ
        </label>
        <label>
          <input class="radios" type="radio" name="select_user"/>邮箱
        </label>
        <button class="button">搜索</button>
      </div>
    </div>
    <div class="user_item_box" v-if="userList">
      <div class="user_item" v-for="(item, index) in userList" :key="index">
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