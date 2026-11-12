<script setup lang="ts">
import { h } from "vue";
import { ElMessageBox } from "element-plus";
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import PCStepsComp from "@/components/PixelConfusion/PCStepsComp.vue";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";
import {
    PC_APP_NAME_CN,
    PC_VERSION_BADGE,
    PC_VERSION_DETAIL
} from "@/utils/PixelConfusion/version";

const store = usePCToolStore();

const helpText = [
    "选择一张普通图片，或使用内置测试图。",
    "",
    "Gilbert 支持任意宽高；Arnold 需要正方形图片。",
    "正向混淆和反向混淆是同一置换的两个方向，反向混淆即复原。",
    "对未混淆的图片点反向混淆，也会得到一张混淆图，这是正常现象。",
    "",
    "单次混淆：按上方次数处理一张。",
    "多次迭代：从 1 到 N 生成整批结果；可开启正反自动混淆，同时查看反向和正向结果集。",
    "结果缩略图可点开预览，再选择用作输入或保存 PNG。",
    "",
    "两个方向请使用相同的次数与参数。",
    "经过缩放、裁剪或有损压缩的混淆图，可能无法精确复原。",
    "支持 PNG / JPG / WEBP / BMP 单帧图片，处理与保存保留原始尺寸和透明通道。",
    "所有处理都在本机完成，不会上传任何文件。",
    "",
    `版本 ${PC_VERSION_DETAIL}`
].join("\n");

const showHelp = () => {
    ElMessageBox.alert(
        h("div", { style: "white-space: pre-line; line-height: 1.8;" }, helpText),
        "使用说明",
        {
            confirmButtonText: "知道啦",
            customClass: "pc_help_dialog",
            closeOnClickModal: true
        }
    ).catch(() => undefined);
};
</script>

<template>
  <header class="pc_appbar">
    <div class="pc_appbar_inner">
      <div class="pc_brand">
        <span class="pc_brand_mark">
          <PCIconComp name="pixelconfusion" :size="20" color="#ffffff"/>
          <span class="pc_brand_star"/>
        </span>
        <span class="pc_brand_name">PixelConfusion</span>
        <span class="pc_version" :title="PC_VERSION_DETAIL">{{ PC_VERSION_BADGE }}</span>
        <span class="pc_brand_divider"/>
        <div class="pc_title_block">
          <h1>像素混淆小工坊</h1>
          <p>{{ PC_APP_NAME_CN }} · 把图片打乱成像素碎片，再用同样的参数悄悄拼回来。</p>
        </div>
      </div>
      <div class="pc_appbar_actions">
        <PCStepsComp :active="store.activeStep"/>
        <button
            type="button"
            class="pc_icon_button"
            title="使用说明"
            aria-label="使用说明"
            @click="showHelp"
        >
          <PCIconComp name="help" :size="16" color="var(--pc-muted)"/>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="sass">
@keyframes pc_star_twinkle
  0%, 100%
    opacity: .65
    transform: scale(.8) rotate(0deg)
  50%
    opacity: 1
    transform: scale(1.15) rotate(20deg)
@keyframes pc_brand_bob
  0%, 100%
    transform: translateY(0) rotate(0deg)
  50%
    transform: translateY(-2px) rotate(-3deg)
.pc_appbar
  position: sticky
  top: 0
  z-index: 40
  width: 100%
  padding: 12px 0 6px
  background: linear-gradient(180deg, rgba(255, 247, 240, .92) 0%, rgba(255, 244, 248, .66) 58%, rgba(255, 247, 245, 0) 100%)
  pointer-events: none
.pc_appbar_inner
  width: calc(100% - 52px)
  max-width: var(--pc-content-width)
  min-height: 66px
  margin: 0 auto
  padding: 0 18px
  display: flex
  align-items: center
  justify-content: space-between
  gap: 24px
  background: rgba(255, 255, 255, .78)
  border: 2px solid #ffffff
  border-radius: 24px
  box-shadow: 0 12px 30px rgba(214, 146, 178, .2), inset 0 1px 0 #ffffff
  backdrop-filter: blur(14px) saturate(1.15)
  pointer-events: auto
.pc_brand
  display: flex
  align-items: center
  min-width: 0
.pc_brand_mark
  position: relative
  width: 40px
  height: 40px
  border-radius: 15px
  background: linear-gradient(145deg, #ffb3cf 0%, #f0709e 55%, #e85b8f 100%)
  display: inline-flex
  align-items: center
  justify-content: center
  flex: none
  border: 2px solid #ffffff
  box-shadow: 0 8px 18px rgba(240, 112, 158, .34), inset 0 -2px 6px rgba(190, 62, 112, .2)
  animation: pc_brand_bob 5.5s ease-in-out infinite
  transition: transform .35s cubic-bezier(.34, 1.56, .64, 1), box-shadow .35s ease
  &:hover
    transform: rotate(-6deg) scale(1.06)
    box-shadow: 0 10px 24px rgba(240, 112, 158, .45), inset 0 -2px 6px rgba(190, 62, 112, .18)
.pc_brand_star
  position: absolute
  top: -4px
  right: -3px
  width: 9px
  height: 9px
  border-radius: 3px
  background: #fff4b8
  border: 1.5px solid #ffffff
  box-shadow: 0 2px 6px rgba(230, 180, 70, .4)
  animation: pc_star_twinkle 2.8s ease-in-out infinite
.pc_brand_name
  margin-left: 11px
  color: var(--pc-text-bright)
  font-family: "BAFJ_CU", "Microsoft YaHei UI", sans-serif
  font-size: 19px
  font-weight: 700
  letter-spacing: .4px
  white-space: nowrap
.pc_version
  margin-left: 8px
  padding: 3px 8px
  border: 1px solid #ffd9e8
  border-radius: 999px
  background: linear-gradient(135deg, #fff2f7, #ffe7f1)
  color: #e8749f
  font-size: 10px
  font-weight: 700
  line-height: 1.2
  white-space: nowrap
  flex: none
  box-shadow: inset 0 1px 0 #ffffff
.pc_brand_divider
  width: 2px
  height: 28px
  margin: 0 14px
  border-radius: 2px
  background: linear-gradient(180deg, rgba(255, 214, 230, 0), #ffd6e6, rgba(255, 214, 230, 0))
  flex: none
.pc_title_block
  min-width: 0
  h1
    display: flex
    align-items: center
    margin: 0
    color: var(--pc-text-bright)
    font-family: "BAFJ_CU", "Microsoft YaHei UI", sans-serif
    font-size: 17px
    font-weight: 700
    line-height: 1.25
    letter-spacing: .5px
    white-space: nowrap
    &::after
      content: "✧"
      margin-left: 6px
      color: #f7a8c6
      font-size: 13px
      animation: pc_star_twinkle 3.6s ease-in-out infinite
  p
    margin: 4px 0 0
    color: var(--pc-muted)
    font-size: 12px
    line-height: 1.35
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
.pc_appbar_actions
  display: flex
  align-items: center
  gap: 16px
  flex: none
.pc_icon_button
  width: 38px
  height: 38px
  padding: 0
  border: 1px solid #ffe1ec
  border-radius: 13px
  background: linear-gradient(145deg, #fff7fa, #ffedf4)
  display: inline-flex
  align-items: center
  justify-content: center
  cursor: pointer
  box-shadow: inset 0 1px 0 #ffffff, 0 3px 8px rgba(214, 146, 178, .14)
  transition: transform .3s cubic-bezier(.34, 1.56, .64, 1), background .25s ease, border-color .25s ease, box-shadow .25s ease
  &:hover
    transform: translateY(-2px) rotate(-8deg)
    background: #ffffff
    border-color: #ffb3d0
    box-shadow: 0 8px 18px rgba(240, 112, 158, .25), inset 0 1px 0 #ffffff
  &:active
    transform: translateY(0) rotate(-4deg) scale(.96)
  &:focus-visible
    outline: 3px solid rgba(239, 111, 159, .35)
    outline-offset: 2px
@media (max-width: 1080px)
  .pc_appbar_inner
    width: calc(100% - 40px)
@media (max-width: 900px)
  .pc_title_block p
    display: none
  .pc_title_block h1
    font-size: 15px
  .pc_version
    display: none
  .pc_brand_divider
    margin: 0 10px
@media (max-width: 720px)
  .pc_appbar
    padding-top: 8px
  .pc_appbar_inner
    width: calc(100% - 24px)
    min-height: 58px
    padding: 0 12px
    gap: 10px
    border-radius: 20px
  .pc_brand_mark
    width: 34px
    height: 34px
    border-radius: 12px
  .pc_brand_divider
    margin: 0 10px
  .pc_brand_name
    font-size: 15px
  .pc_version
    display: none
  .pc_title_block
    display: none
  .pc_appbar_actions
    gap: 10px
@media (prefers-reduced-motion: reduce)
  .pc_brand_mark, .pc_brand_star, .pc_title_block h1::after
    animation: none
</style>

<style lang="sass">
// 使用说明弹窗被挂载到 body，需要独立的浅色奶果风样式
.el-overlay:has(.el-message-box.pc_help_dialog)
  background-color: rgba(255, 235, 244, .48)
  backdrop-filter: blur(5px)
.el-message-box.pc_help_dialog
  --el-messagebox-width: 500px
  width: min(500px, calc(100vw - 32px))
  padding: 20px 22px 16px
  background: linear-gradient(165deg, #fffdfb 0%, #fff7f2 52%, #fff3f8 100%)
  border: 2px solid #ffffff
  border-radius: 26px
  color: #6e5765
  box-shadow: 0 28px 70px rgba(178, 118, 148, .3), 0 0 0 1px rgba(240, 112, 158, .1), inset 0 2px 0 #ffffff
  .el-message-box__header
    padding-bottom: 8px
  .el-message-box__title
    color: #54414f
    font-family: "BAFJ_CU", "Microsoft YaHei UI", sans-serif
    font-size: 16px
    font-weight: 700
    letter-spacing: .5px
  .el-message-box__headerbtn
    top: 16px
    right: 16px
    width: 30px
    height: 30px
    border-radius: 10px
    transition: background .25s ease, transform .25s ease
    &:hover
      background: #ffe9f2
      transform: rotate(90deg)
  .el-message-box__headerbtn .el-message-box__close
    color: #b09aa7
    &:hover
      color: #e85b8f
  .el-message-box__content
    max-height: 60vh
    padding: 6px 0 0
    overflow-y: auto
    color: #6e5765
    font-size: 12px
    line-height: 1.8
    &::-webkit-scrollbar
      width: 8px
    &::-webkit-scrollbar-track
      background: transparent
    &::-webkit-scrollbar-thumb
      background: #ffd0e2
      border-radius: 999px
      border: 2px solid #fff7f2
  .el-message-box__message
    padding-left: 0
    color: #6e5765
    p
      line-height: 1.8
  .el-message-box__status
    display: none
  .el-message-box__btns
    padding-top: 16px
    .el-button
      height: 36px
      padding: 0 20px
      border-radius: 999px
      font-family: inherit
      font-weight: 700
    .el-button--primary
      background: linear-gradient(135deg, #ffa6c6 0%, #f0709e 60%, #e85b8f 100%)
      border: 2px solid #ffffff
      color: #ffffff
      box-shadow: 0 8px 20px rgba(240, 112, 158, .3)
      transition: transform .25s ease, box-shadow .25s ease, filter .25s ease
      &:hover
        background: linear-gradient(135deg, #ffb3cf 0%, #f584ac 60%, #f0709e 100%)
        border-color: #ffffff
        transform: translateY(-2px)
        box-shadow: 0 12px 24px rgba(240, 112, 158, .38)
      &:active
        transform: translateY(0) scale(.97)
@media (max-width: 720px)
  .el-message-box.pc_help_dialog
    padding: 16px 16px 12px
    border-radius: 22px
    .el-message-box__content
      max-height: 56vh
</style>
