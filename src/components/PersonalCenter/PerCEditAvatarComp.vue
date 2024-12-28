<script setup lang="ts">
import {nextTick, ref} from "vue";
import {useRouter} from "vue-router";
const router = useRouter();
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css"
import {httpSpring} from "@/utils/http";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
const userDetailStore = useUserDetailStore();

let cropper: Cropper | null = null;

const avatarSrc = ref<string | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const clickInput = () => {if (inputRef.value) inputRef.value.click();}
const returnRouter = () => {router.back();}

const initCropper = () => {
  if (cropper !== null) cropper.destroy();
  const image = document.getElementById("avatar") as HTMLImageElement;
  cropper = new Cropper(image, {
    viewMode: 1, aspectRatio: 1, cropBoxResizable: false, toggleDragModeOnDblclick: false, movable: false, preview: '.img_preview'
  })
}
const selectImageFile = (e: Event) => {
  avatarSrc.value = null;
  const {files} = e.target as HTMLInputElement;
  if (!files || !files.length) return;
  const file = files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = (e: Event) => {
    avatarSrc.value = String(reader.result);
    if (inputRef.value) inputRef.value.value = "";
    nextTick(() => {initCropper();})
  }
}
const uploadClicked = () => {
  const cropperCanvas = cropper?.getCroppedCanvas({
    width: 264, height: 264
  });
  console.log(userDetailStore.userDetails.group_real_user_id.toLowerCase());
  cropperCanvas?.toBlob(blob => {
    if (blob) {
      console.log(blob);
      const fileName = userDetailStore.userDetails.group_real_user_id.toLowerCase();
      const formData = new FormData();
      formData.append("file", blob, fileName);
      console.log(formData);
      httpSpring({
        url: "users/edit_archive/avatar",
        method: "POST",
        headers: {"Content-Type": "multipart/form-data", Authorization: window.localStorage.getItem("token")},
        data: formData
      }).then(res => {
        if (res?.data?.code === 0) {
          showMessageNotice('green', res?.data?.data);
          userDetailStore.fetchUserArchive();
          userDetailStore.fetchUserAvatar();
          window.location.reload();
        } else showMessageNotice('red', res?.data?.message);
      }).catch(err => {console.error(err); showExceptionNotice();})
    }
  })
}
const uploadQQAvatar = () => {
  httpSpring({
    url: 'users/edit_archive/avatar_qq',
    method: 'GET',
    headers: {Authorization: window.localStorage.getItem("token")}
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotice('green', res?.data?.data);
      userDetailStore.fetchUserArchive();
      userDetailStore.fetchUserAvatar();
      window.location.reload();
    } else showMessageNotice('red', res?.data?.message);
  }).catch(err => {console.error(err); showExceptionNotice();})
}
</script>

<template>
  <div class="edit_avatar_box">
    <div class="avatar_and_preview">
      <div class="avatar_box">
        <input type="file" ref="inputRef" style="display: none" accept="image/jpeg,image/png,image/jpg" @change="selectImageFile"/>
        <img v-if="avatarSrc" id="avatar" :src="avatarSrc" alt="avatar"/>
        <div class="avatar_box_no" v-else>
          <p>请选择图片</p>
          <button @click="clickInput" class="select_img_button">点击选择</button>
        </div>
      </div>
      <div class="img_preview_box">
        <div class="img_preview img_preview264"></div>
        <div class="img_preview img_preview128"></div>
        <div class="img_preview img_preview60"></div>
      </div>
    </div>
    <div class="button_box">
      <p>右侧为您提供264px, 128px, 60px三种大小预览！</p>
      <el-button v-if="avatarSrc" native-type="button" type="primary" @click="uploadClicked">确认上传</el-button>
      <el-button v-if="avatarSrc" native-type="button" type="warning" @click="clickInput">重新选择</el-button>
      <el-button native-type="button" type="success" title="将使用绑定QQ头像" @click="uploadQQAvatar">QQ头像</el-button>
      <el-button native-type="button" type="warning" @click="returnRouter">取消上传</el-button>
    </div>
  </div>
</template>

<style scoped lang="sass">
.edit_avatar_box
  flex: 1
  display: flex
  flex-direction: column
  .avatar_and_preview
    display: flex
    flex-direction: row
    gap: 50px
    .avatar_box
      width: 600px
      height: 300px
      border: #f0d4eb solid 1px
      border-radius: 10px
      #avatar
        width: 100%
        height: 100%
      .avatar_box_no
        display: flex
        flex-direction: column
        align-items: center
        .select_img_button:hover
          background-color: #e4e4e4
          cursor: pointer
        .select_img_button
          color: #666
          letter-spacing: 1px
          font-family: BAFJ_CU, sans-serif
          font-weight: bold
          font-size: 16px
          width: 50%
          height: 38px
          border: #b4bccf 1px solid
          border-radius: 5px
          background-color: #f6f6f6
          transition: .2s ease
    .img_preview_box
      display: flex
      flex-direction: row
      align-items: end
      gap: 10px
      .img_preview
        border: #f0d4eb 1px solid
        border-radius: 50%
        overflow: hidden
      .img_preview264
        width: 264px
        height: 264px
      .img_preview128
        width: 128px
        height: 128px
      .img_preview60
        width: 60px
        height: 60px
  .button_box
    margin-top: 20px
    color: #57505d
</style>