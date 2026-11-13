<script setup lang="ts">
import { computed, h } from "vue";
import { ElMessageBox } from "element-plus";
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import PCStepsComp from "@/components/PixelConfusion/PCStepsComp.vue";
import { usePCTheme } from "@/composables/usePCTheme";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";
import {
    PC_APP_NAME_CN,
    PC_VERSION_BADGE,
    PC_VERSION_DETAIL
} from "@/utils/PixelConfusion/version";

const store = usePCToolStore();
const { isCute, toggleTheme } = usePCTheme();

const pageTitle = computed(() => (isCute.value ? "像素混淆小工坊" : "图片混淆与复原"));
const pageSubtitle = computed(() => (isCute.value
    ? `${PC_APP_NAME_CN} · 把图片打乱成像素碎片，再用同样的参数悄悄拼回来。`
    : `${PC_APP_NAME_CN} · 打乱像素顺序，再用相同的参数完整还原。`));

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
    "右上角的「二次元」开关可切换界面样式，选择会保存在本机浏览器。",
    "",
    `版本 ${PC_VERSION_DETAIL}`
].join("\n");

const showHelp = () => {
    ElMessageBox.alert(
        h("div", { style: `white-space: pre-line; line-height: ${isCute.value ? 1.8 : 1.75};` }, helpText),
        "使用说明",
        {
            confirmButtonText: isCute.value ? "知道啦" : "知道了",
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
          <PCIconComp name="pixelconfusion" :size="isCute ? 20 : 19" color="#ffffff"/>
          <span v-if="isCute" class="pc_brand_star"/>
        </span>
        <span class="pc_brand_name">PixelConfusion</span>
        <span class="pc_version" :title="PC_VERSION_DETAIL">{{ PC_VERSION_BADGE }}</span>
        <span class="pc_brand_divider"/>
        <div class="pc_title_block">
          <h1>{{ pageTitle }}</h1>
          <p>{{ pageSubtitle }}</p>
        </div>
      </div>
      <div class="pc_appbar_actions">
        <PCStepsComp :active="store.activeStep"/>
        <div class="pc_theme_switch">
          <button
              type="button"
              class="pc_theme_switch_button"
              role="switch"
              aria-labelledby="pc_theme_switch_label"
              :aria-checked="isCute"
              :title="isCute ? '当前为二次元样式，点击切回深色商务样式' : '当前为深色商务样式，点击切换到二次元样式'"
              @click="toggleTheme"
          >
            <span class="pc_theme_switch_track" aria-hidden="true">
              <span class="pc_theme_switch_thumb"/>
            </span>
          </button>
          <span id="pc_theme_switch_label" class="pc_theme_switch_text">二次元</span>
        </div>
        <button
            type="button"
            class="pc_icon_button"
            title="使用说明"
            aria-label="使用说明"
            @click="showHelp"
        >
          <PCIconComp name="help" :size="16" :color="isCute ? 'var(--pc-muted)' : '#b8bec6'"/>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="sass">
// 深色商务主题（默认）：7570a23 原版样式

html[data-pc-theme="dark"]
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

html[data-pc-theme="dark"]
  .pc_theme_switch
    display: inline-flex
    align-items: center
    gap: 7px
    min-height: 32px
    flex: none
    user-select: none
  .pc_theme_switch_button
    display: inline-flex
    align-items: center
    justify-content: center
    padding: 4px
    margin: -4px
    border: 0
    border-radius: 999px
    background: transparent
    cursor: pointer
    &:hover .pc_theme_switch_track
      border-color: #6e737b
      background: #45484d
    &:hover .pc_theme_switch_thumb
      background: #f0f1f2
    &:active .pc_theme_switch_thumb
      transform: translateY(-50%) scale(.92)
    &:focus-visible
      outline: none
      .pc_theme_switch_track
        box-shadow: 0 0 0 3px rgba(47, 107, 255, .42)
  .pc_theme_switch_track
    position: relative
    width: 40px
    height: 24px
    flex: none
    border: 1px solid #55595f
    border-radius: 999px
    background: #3a3d41
    transition: background .2s ease, border-color .2s ease, box-shadow .2s ease
  .pc_theme_switch_thumb
    position: absolute
    top: 50%
    left: 2px
    width: 18px
    height: 18px
    border-radius: 50%
    background: #d7dae0
    transform: translateY(-50%)
    transition: transform .2s ease, background .2s ease
  .pc_theme_switch_text
    color: var(--pc-text)
    font-family: inherit
    font-size: 11px
    font-weight: 400
    line-height: 1
    white-space: nowrap
    cursor: default
  .pc_theme_switch_button[aria-checked="true"]
    .pc_theme_switch_track
      border-color: var(--pc-accent-light)
      background: var(--pc-ink)
    .pc_theme_switch_thumb
      transform: translate(16px, -50%)
  @media (max-width: 1080px)
    .pc_theme_switch_text
      display: none
  @media (max-width: 720px)
    .pc_theme_switch_track
      width: 34px
      height: 20px
    .pc_theme_switch_thumb
      width: 14px
      height: 14px
    .pc_theme_switch_button[aria-checked="true"] .pc_theme_switch_thumb
      transform: translate(14px, -50%)
  @media (max-width: 480px)
    .pc_version
      display: none

// 二次元主题：仅 html[data-pc-theme="cute"] 下生效

@keyframes pc_cute_pc_star_twinkle
  0%, 100%
    opacity: .65
    transform: scale(.8) rotate(0deg)
  50%
    opacity: 1
    transform: scale(1.15) rotate(20deg)

@keyframes pc_cute_pc_brand_bob
  0%, 100%
    transform: translateY(0) rotate(0deg)
  50%
    transform: translateY(-2px) rotate(-3deg)

html[data-pc-theme="cute"]
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
    animation: pc_cute_pc_brand_bob 5.5s ease-in-out infinite
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
    animation: pc_cute_pc_star_twinkle 2.8s ease-in-out infinite
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
        animation: pc_cute_pc_star_twinkle 3.6s ease-in-out infinite
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
  .pc_theme_switch
    display: inline-flex
    align-items: center
    gap: 8px
    min-height: 38px
    flex: none
    user-select: none
  .pc_theme_switch_button
    display: inline-flex
    align-items: center
    justify-content: center
    padding: 4px
    margin: -4px
    border: 0
    border-radius: 999px
    background: transparent
    cursor: pointer
    &:hover .pc_theme_switch_track
      border-color: #ffffff
      box-shadow: 0 6px 16px rgba(240, 112, 158, .32), inset 0 1px 0 rgba(255, 255, 255, .45)
    &:hover .pc_theme_switch_thumb
      transform: translateY(-50%) scale(1.06)
    &:active .pc_theme_switch_thumb
      transform: translateY(-50%) scale(.94)
    &:focus-visible
      outline: none
      .pc_theme_switch_track
        box-shadow: 0 0 0 3px rgba(239, 111, 159, .3)
  .pc_theme_switch_track
    position: relative
    width: 48px
    height: 28px
    flex: none
    border: 2px solid #f6dcea
    border-radius: 999px
    background: #f9eef3
    box-shadow: inset 0 2px 4px rgba(214, 146, 178, .1)
    transition: background .3s ease, border-color .3s ease, box-shadow .3s ease
  .pc_theme_switch_thumb
    position: absolute
    top: 50%
    left: 2px
    width: 20px
    height: 20px
    border-radius: 50%
    background: #ffffff
    transform: translateY(-50%)
    box-shadow: 0 1px 3px rgba(190, 120, 150, .28)
    transition: transform .32s cubic-bezier(.34, 1.56, .64, 1), background .25s ease, box-shadow .25s ease
  .pc_theme_switch_text
    color: #e8749f
    font-family: "BAFJ_CU", "Microsoft YaHei UI", sans-serif
    font-size: 12.5px
    font-weight: 700
    line-height: 1
    white-space: nowrap
    cursor: default
  .pc_theme_switch_button[aria-checked="true"]
    .pc_theme_switch_track
      background: linear-gradient(135deg, #ffa6c6, #f0709e 60%, #e85b8f)
      border-color: #ffffff
      box-shadow: 0 4px 12px rgba(240, 112, 158, .3), inset 0 1px 0 rgba(255, 255, 255, .4)
    .pc_theme_switch_thumb
      transform: translate(20px, -50%)
      box-shadow: 0 2px 6px rgba(190, 60, 110, .3)
    &:hover .pc_theme_switch_track
      box-shadow: 0 6px 16px rgba(240, 112, 158, .38), inset 0 1px 0 rgba(255, 255, 255, .4)
    &:hover .pc_theme_switch_thumb
      transform: translate(20px, -50%) scale(1.06)
    &:active .pc_theme_switch_thumb
      transform: translate(20px, -50%) scale(.94)
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
    .pc_theme_switch_text
      display: none
  @media (max-width: 900px)
    .pc_title_block p
      display: none
    .pc_title_block h1
      font-size: 15px
    .pc_version
      display: none
    .pc_brand_divider
      margin: 0 10px
  @media (max-width: 820px)
    .pc_title_block
      display: none
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
    .pc_theme_switch_track
      width: 40px
      height: 22px
    .pc_theme_switch_thumb
      width: 16px
      height: 16px
    .pc_theme_switch_button[aria-checked="true"]
      .pc_theme_switch_thumb
        transform: translate(16px, -50%)
      &:hover .pc_theme_switch_thumb
        transform: translate(16px, -50%) scale(1.06)
      &:active .pc_theme_switch_thumb
        transform: translate(16px, -50%) scale(.94)
  @media (prefers-reduced-motion: reduce)
    .pc_brand_mark, .pc_brand_star, .pc_title_block h1::after
      animation: none
</style>

<style lang="sass">
// 深色商务主题（默认）：7570a23 原版样式

html[data-pc-theme="dark"]
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

// 二次元主题：仅 html[data-pc-theme="cute"] 下生效

html[data-pc-theme="cute"]
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
