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
        h("div", { style: "white-space: pre-line; line-height: 1.75;" }, helpText),
        "使用说明",
        {
            confirmButtonText: "知道了",
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
          <PCIconComp name="pixelconfusion" :size="19" color="#ffffff"/>
        </span>
        <span class="pc_brand_name">PixelConfusion</span>
        <span class="pc_version" :title="PC_VERSION_DETAIL">{{ PC_VERSION_BADGE }}</span>
        <span class="pc_brand_divider"/>
        <div class="pc_title_block">
          <h1>图片混淆与复原</h1>
          <p>{{ PC_APP_NAME_CN }} · 打乱像素顺序，再用相同的参数完整还原。</p>
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
          <PCIconComp name="help" :size="16" color="#b8bec6"/>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="sass">
.pc_appbar
  position: sticky
  top: 0
  z-index: 40
  width: 100%
  min-height: 62px
  background: var(--pc-surface)
  border-bottom: 1px solid var(--pc-line)
  backdrop-filter: blur(8px)
.pc_appbar_inner
  width: 100%
  max-width: var(--pc-content-width)
  min-height: 62px
  margin: 0 auto
  padding: 0 26px
  display: flex
  align-items: center
  justify-content: space-between
  gap: 24px
  box-sizing: border-box
.pc_brand
  display: flex
  align-items: center
  min-width: 0
.pc_brand_mark
  width: 32px
  height: 32px
  border-radius: 8px
  background: var(--pc-ink)
  display: inline-flex
  align-items: center
  justify-content: center
  flex: none
  box-shadow: 0 0 0 1px rgba(110, 164, 255, .18), 0 6px 16px rgba(47, 107, 255, .22)
.pc_brand_name
  margin-left: 10px
  color: var(--pc-text-bright)
  font-size: 17px
  font-weight: 700
  letter-spacing: .2px
  white-space: nowrap
.pc_version
  margin-left: 7px
  padding: 2px 6px
  border: 1px solid var(--pc-line-strong)
  border-radius: 4px
  background: var(--pc-surface-alt)
  color: var(--pc-muted)
  font-size: 10px
  line-height: 1.2
  white-space: nowrap
  flex: none
.pc_brand_divider
  width: 1px
  height: 24px
  background: var(--pc-line-strong)
  margin: 0 14px
  flex: none
.pc_title_block
  min-width: 0
  h1
    margin: 0
    color: var(--pc-text-bright)
    font-size: 15px
    font-weight: 700
    line-height: 1.25
  p
    margin: 3px 0 0
    color: var(--pc-muted)
    font-size: 12px
    line-height: 1.3
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
.pc_appbar_actions
  display: flex
  align-items: center
  gap: 16px
  flex: none
.pc_icon_button
  width: 32px
  height: 32px
  padding: 0
  border: 1px solid transparent
  border-radius: 6px
  background: transparent
  display: inline-flex
  align-items: center
  justify-content: center
  cursor: pointer
  transition: background .2s ease, border-color .2s ease
  &:hover
    background: #35373b
    border-color: var(--pc-line-strong)
  &:focus-visible
    outline: 2px solid var(--pc-ink)
    outline-offset: 2px
@media (max-width: 900px)
  .pc_title_block p
    display: none
  .pc_title_block h1
    font-size: 14px
@media (max-width: 720px)
  .pc_appbar_inner
    padding: 0 16px
    gap: 12px
  .pc_brand_divider
    margin: 0 10px
  .pc_brand_name
    font-size: 15px
  .pc_title_block
    display: none
  .pc_appbar_actions
    gap: 10px
</style>

<style lang="sass">
// The help alert is teleported to <body>, so it needs its own dark styling
// instead of inheriting the tokens scoped to .pc_page. The doubled class also
// makes these rules win over Element Plus defaults regardless of CSS order.
.el-message-box.pc_help_dialog
  --el-messagebox-width: 480px
  width: min(480px, calc(100vw - 32px))
  background: #25272a
  border: 1px solid #45484d
  border-radius: 8px
  padding: 16px 18px
  color: #d7dae0
  box-shadow: 0 24px 70px rgba(0, 0, 0, .55)
  .el-message-box__header
    padding-bottom: 6px
  .el-message-box__title
    color: #f0f1f2
    font-size: 14px
    font-weight: 700
  .el-message-box__headerbtn
    top: 14px
    right: 14px
  .el-message-box__headerbtn .el-message-box__close
    color: #8b9098
    &:hover
      color: #d7dae0
  .el-message-box__content
    max-height: 60vh
    padding: 4px 0 0
    overflow-y: auto
    color: #d7dae0
    font-size: 12px
    &::-webkit-scrollbar
      width: 8px
    &::-webkit-scrollbar-thumb
      background: #45484d
      border-radius: 4px
  .el-message-box__message
    padding-left: 0
    color: #d7dae0
  .el-message-box__status
    display: none
  .el-message-box__btns
    padding-top: 14px
    .el-button--primary
      background: #2f6bff
      border-color: #4279ff
      color: #ffffff
      &:hover
        background: #3c76ff
        border-color: #6ea4ff
@media (max-width: 720px)
  .el-message-box.pc_help_dialog
    padding: 14px
    .el-message-box__content
      max-height: 56vh
</style>
