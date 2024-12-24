<script setup lang="ts">
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css"
import {nextTick, ref} from "vue";
import {httpSpring} from "@/utils/http";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific";

const imageSrc = ref<string | null>(null);
const inputImage = ref<HTMLInputElement | null>(null); // 文件选择控件引用

let cropper: Cropper | null = null;

const tiggerInput = () => {
  if (inputImage.value) inputImage.value.click();
}
const initCropper = () => {
  if (cropper !== null) cropper.destroy();
  const image = document.getElementById("avatar_image") as HTMLImageElement;
  cropper = new Cropper(image, {
    viewMode: 1, aspectRatio: 1, cropBoxResizable: false, toggleDragModeOnDblclick: false, movable: false, preview: '.img_preview'
  })
}
const selectImageFile = (e: Event) => {
  imageSrc.value = null;
  const {files} = e.target as HTMLInputElement;
  if (!files || !files.length) return;
  const file = files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = (e: Event) => {
    imageSrc.value = String(reader.result);
    if (inputImage.value) inputImage.value.value = "";
    nextTick(() => {initCropper();})
  }
}
const uploadClicked = () => {
  const cropperCanvas = cropper?.getCroppedCanvas({
    width: 264, height: 264
  });
  cropperCanvas?.toBlob(blob => {
    if (blob) {
      console.log(blob);
      const fileName = 'avatar';
      const formData = new FormData();
      formData.append("file", blob, fileName);
      console.log(formData);
      httpSpring({
        url: "api/file/upload",
        method: "POST",
        headers: {"Content-Type": "multipart/form-data", Authorization: window.localStorage.getItem("token")},
        data: formData
      }).then(res => {
        if (res?.data?.code === 0) {
          showMessageNotice('green', res?.data?.data);
        } else showMessageNotice('red', res?.data?.message);
      }).catch(err => {console.error(err); showExceptionNotice();})
    }
  })
}
</script>
<template>
  <div class="avatar_text_container">
    <div class="avatar_box" style="width: 600px; height: 400px; border: #57505d 1px solid;">
      <input type="file" ref="inputImage" style="display: none" accept="image/jpeg, image/png, image/jpg" @change="selectImageFile" />
      <img v-if="imageSrc" id="avatar_image" style="max-width: 100%" :src="imageSrc" alt="avatar"/>
      <div v-else @click="tiggerInput">点击上传图片</div>
    </div>
  <div class="img_preview img_preview_264">

  </div>
    <button @click="tiggerInput">重新选择</button>
    <button @click="uploadClicked">确认裁剪</button>
  </div>
</template>
<style lang="sass">
.img_preview
  border: #57505d 1px solid
  border-radius: 50%
  overflow: hidden

.img_preview_264
  width: 264px
  height: 264px
</style>