<script setup lang="ts">
import { usePersonStore } from '@/stores/PersonCenter';
import {ref, watch} from "vue";
const store = usePersonStore();

const userForm = ref({id: 0, qq_id: 0, score: 0, favorite: 0, city: '', email: ''});

watch(() => store.data, (newData) => {
  if (newData){
    userForm.value.id = newData['id'];
    userForm.value.qq_id = newData['qq_id'];
    userForm.value.city = newData['city'];
    userForm.value.email = newData['email'];
    userForm.value.score = newData['score'];
    userForm.value.favorite = newData['favorite'];
  }
})
</script>

<template>
  <form class="user_form_box" @submit.prevent="() => {console.log(userForm)}">
    <div class="user_id">用户ID：{{ userForm.id }}</div>
    <div>小布丁：{{userForm.score}}&nbsp;好感度：{{userForm.favorite}}</div>
    <div>QQ号：<input :value="userForm.qq_id"></div>
    <div>电子邮箱：<input :value="userForm.email"></div>
    <div>城市：<input :value="userForm.city"></div>
    <button type="submit">提交资料</button>
  </form>
</template>

<style scoped lang="sass">

</style>