<script setup lang="ts">
import SignBgComp from "@/components/Sign/SignBgComp.vue";

interface loginFormImpl {
  account: string;
  password?: string;
  code?: string;
  loginType: string;
}
interface registerFormImpl {
  account: string;
  password: string;
  code: string;
  registerType: string;
}

</script>

<template>
  <div class="container">
    <SignBgComp/>
    <div class="sign_form_box">
      <img class="title_logo" src="@/assets/Sign/login_register.png" alt="title"/>
      <el-form class="login_form">
        <el-form-item label="账号：">
          <input type="text" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="sass">
@keyframes title_logo_in
  0%
    opacity: 0
    top: 0
  100%
    opacity: 1
    top: 10%
@mixin title_logo_in_ani()
  animation: title_logo_in .8s ease
  animation-fill-mode: forwards
.container
  width: 100%
  height: 100vh
  position: relative
  .title_logo
    position: absolute
    top: 0
    left: 50%
    transform: translateX(-50%)
    filter: drop-shadow(0px 0px 4px rgb(255, 255, 255))
    @include title_logo_in_ani()
  .login_form
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
</style>