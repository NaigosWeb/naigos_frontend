<script setup lang="ts">
import {ref} from "vue";
import {httpSpring} from "@/utils/http";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";
import {useRouter} from "vue-router";
const router = useRouter();

interface PasswordFormImpl {
  origin_password: string | null;
  new_password: string | null;
  confirm_password: string | null;
}

const passwordForm = ref<PasswordFormImpl>({
  origin_password: null,
  new_password: null,
  confirm_password: null,
});

const updateClicked = () => {
  if (passwordForm.value.new_password === passwordForm.value.confirm_password) {
    httpSpring({
      url: 'users/edit_archive/password',
      method: 'POST',
      headers: {Authorization: window.localStorage.getItem('token')},
      params: passwordForm.value
    }).then(res => {
      if (res?.data?.code === 0) {
        showMessageNotice('green', res?.data?.data);
        router.back();
      } else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();});
  }
}

const returnClicked = () => {
  router.back();
}
</script>

<template>
  <div class="edit_password_box">
    <el-form label-width="auto" :model="passwordForm" style="width: 800px;" @submit.prevent="updateClicked">
      <el-form-item label="原密码：">
        <el-input placeholder="如账号本身没有密码，可不填写" v-model="passwordForm.origin_password"/>
      </el-form-item>
      <el-form-item label="新密码：">
        <el-input v-model="passwordForm.new_password" type="password"/>
      </el-form-item>
      <el-form-item label="确认密码：">
        <el-input v-model="passwordForm.confirm_password" type="password"/>
      </el-form-item>
      <el-button type="primary" native-type="submit">确认修改</el-button>
      <el-button type="warning" native-type="button" @click="returnClicked">取消修改</el-button>
    </el-form>
  </div>
</template>

<style scoped lang="sass">

</style>