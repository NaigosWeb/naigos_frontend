<script setup lang="ts">
import "./login.sass";
import "./nopwd_login.sass";
import {onBeforeMount, ref} from "vue";
import {http} from "@/utils/http";

const formLogin = ref({
  account: '',
  password: '',
  code: '',
  login_type: 'unknown'
})

const loginFunctionState = ref(0),
    loginTitle = ref(''),
    loginEnTitle = ref('');
let isFirstLoginRequestCodeClicked = ref(false),
    noPwdLoginRequestCodeButton = '获取无密验证码';
let countdown = ref(120); // 初始倒计时时间
const countdownName = ref(`${countdown.value}秒后重试`);
const isDisabled = ref(false); // 按钮是否禁用

function normalLogin(){
  console.log(formLogin.value);
  http({
    url: 'users/login',
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: formLogin.value,
  }).then(res => {
    if (res.data.code === 0){
      console.log('登录成功', res.data)
      localStorage.setItem('token', res.data.data);
    } else {
      alert(res.data.message);
    }
  }).catch(err => {
    console.error(err);
  })
}

const noPwdLoginIntroduce = '无密登录适用首次登录、忘记密码等用户，' +
    '输入正确UID后会给您一个6位的验证码，您需要在任何存在【奶果酱】的群聊发送@奶果 /无密登录 验证码，' +
    '成功收到后会给您在群内回复信息，即可在网页中登入。';
const nopwdRequestCodeButtonClicked = () => {
  isFirstLoginRequestCodeClicked.value = true;
  isDisabled.value = true; // 禁用按钮
  function nopwdRequestCode(){
    http({
      url: 'users/login',
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: formLogin.value
    }).then(res => {
      if (res.data.code === 0){
        formLogin.value.code = res.data.data;
      } else {
        alert(res.data.message)
        countdown.value = 1;
      }
    }).catch(err => {
      console.error(err);
    })
  }
  nopwdRequestCode();
  let intervalId = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
      countdownName.value = `${countdown.value}秒后重试`;
    } else {
      clearInterval(intervalId); // 清除定时器
      isDisabled.value = false; // 恢复按钮可点击状态
      countdown.value = 120; // 重置倒计时时间（如果需要）
    }}, 1000); // 每秒更新一次
}

function nopwdLogin(){
  http({
    url: 'users/nopwd_login',
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: formLogin.value
  }).then(res => {
    if (res.data.code === 0){
      console.log('登录成功', res.data)
      localStorage.setItem('token', res.data.data);
    } else {
      alert(res.data.message);
    }
  }).catch(err => {
    console.error(err);
  })
}
const selectLoginFunction = (target: number) => {
  loginFunctionState.value = target;
  changeLoginTitle(target);
}
const changeLoginTitle = (target: number) => {
  switch (target){
    case 0: {
      loginTitle.value = '普通登录';
      loginEnTitle.value = 'Sign in Naigos Archive';
      formLogin.value.login_type = 'normal';
      break;
    } case 1: {
      loginTitle.value = '无密码登录';
      loginEnTitle.value = 'No pwd Sign in Naigos Archive';
      formLogin.value.login_type = 'nopwd';
      break;
    }default: break;
  }
}
onBeforeMount(() => {
  changeLoginTitle(loginFunctionState.value);
})



</script>

<template>
  <div id="signBG_box">
    <img id="signBG" src="@/assets/119296081_p0.png" alt="signBG"/>
  </div>
  <div class="sign_box">
    <div class="title">{{loginTitle}}</div>
    <div class="en_title">{{loginEnTitle}}</div>
    <div id="nopwd_login" v-if="loginFunctionState === 1">
      <form class="form_box" @submit.prevent="nopwdLogin">
        <form @submit.prevent="nopwdRequestCodeButtonClicked" class="rc_box">
          <input type="text" required placeholder="请输入奶果档案UID" v-model="formLogin.account"/>
          <button :disabled="isDisabled" type="submit" class="get_code">{{isDisabled ? countdownName : noPwdLoginRequestCodeButton}}</button>
        </form>
        <p class="code_box">本次验证码：<span v-if="isFirstLoginRequestCodeClicked" class="code">{{ formLogin.code }}</span></p>
        <button class="login_button" v-if="isFirstLoginRequestCodeClicked">登录Naigos</button>
        <p style="
        color: white;
        letter-spacing: 1px;
        display: block;
        margin: 0 auto;
        width: 30%;
        font-size: 14px;"
           v-if="isFirstLoginRequestCodeClicked" class="login_introduce">{{noPwdLoginIntroduce}}</p>
      </form>
    </div>
    <div id="login" v-if="loginFunctionState === 0">
      <form class="form_box" @submit.prevent="normalLogin">
        <input class="input_id" type="text" placeholder="请输入奶果档案ID/手机号码/电子邮箱" v-model="formLogin.account" required/>
        <input class="input_pwd" type="password" placeholder="请输入密码" v-model="formLogin.password" required/>
        <button class="login_button" type="submit">登入Naigos</button>
      </form>
    </div>
    <div class="select_login_box">
      <button @click="selectLoginFunction(0)" v-if="loginFunctionState === 1">普通登录</button>
      <button @click="selectLoginFunction(1)" v-else-if="loginFunctionState === 0">无密码登录</button>
    </div>
  </div>
</template>

<style scoped lang="sass">
@keyframes box_bg_in
  0%
    opacity: 0
  100%
    opacity: 1
#signBG_box
  opacity: 0
  animation: box_bg_in 1s ease
  animation-fill-mode: forwards
  position: fixed
  width: 100vw
  height: 100vh
  overflow: hidden
  z-index: -1
  #signBG
    width: 100vw
.sign_box
  opacity: 0
  animation: box_bg_in 1s .6s ease
  animation-fill-mode: forwards
  position: fixed
  background-color: #00000040
  border-radius: 50px
  height: 80vh
  width: 50%
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  .title
    text-align: center
    font-weight: bold
    font-size: 25px
    margin-top: 100px
    color: #fdcaf7
  .en_title
    text-align: center
    font-size: 14px
    margin-bottom: 80px
    color: #cae0fd
  .select_login_box
    margin: 0 auto
    display: block
    button:hover
      background-color: #fdcaf7
      cursor: pointer
    button
      display: block
      margin: 10px auto 0 auto
      background-color: #cae0fd
      border-radius: 5px
      height: 30px
      padding: 0 20px
      border: none
      color: #57505d
      font-weight: bold
      letter-spacing: 1px
      transition: .5s ease background-color
</style>