<script setup lang="ts">
import PCBgComp from "@/components/PixelConfusion/PCBgComp.vue";
import PCAppBarComp from "@/components/PixelConfusion/PCAppBarComp.vue";
import PCResultPreviewComp from "@/components/PixelConfusion/PCResultPreviewComp.vue";
import PCWorkspaceComp from "@/components/PixelConfusion/PCWorkspaceComp.vue";
import { usePCTheme } from "@/composables/usePCTheme";

const { isCute } = usePCTheme();
</script>

<template>
  <div class="pc_page">
    <PCBgComp v-if="isCute"/>
    <PCAppBarComp/>
    <main class="pc_page_main">
      <PCWorkspaceComp/>
      <footer v-if="isCute" class="pc_page_foot">
        <span class="pc_foot_heart">♥</span>
        <span>奶果 Naigos · 像素混淆器</span>
        <span class="pc_foot_sep">·</span>
        <span>所有处理都在本机完成，图片不会离开你</span>
      </footer>
    </main>
    <PCResultPreviewComp/>
  </div>
</template>

<style scoped lang="sass">
// 深色商务主题（默认）：7570a23 原版样式

html[data-pc-theme="dark"]
  .pc_page
    min-height: 100vh
    width: 100%
    background: var(--pc-bg)
    background-image: radial-gradient(circle at 72% -8%, rgba(47, 107, 255, .10), transparent 42%)
    color: var(--pc-text)
    font-size: 13px
    -webkit-font-smoothing: antialiased
    text-rendering: optimizeLegibility
    box-sizing: border-box
    ::selection
      background: var(--pc-select)
      color: var(--pc-text-bright)
  .pc_page_main
    width: 100%
    max-width: var(--pc-content-width)
    min-height: calc(100vh - 63px)
    margin: 0 auto
    padding: 18px 26px 26px
  @media (max-width: 1080px)
    .pc_page_main
      padding: 16px 20px 24px
  @media (max-width: 720px)
    .pc_page_main
      padding: 12px 12px 20px

// 二次元主题：仅 html[data-pc-theme="cute"] 下生效

@keyframes pc_cute_pc_foot_beat
  0%, 100%
    transform: scale(1)
  18%
    transform: scale(1.28)
  36%
    transform: scale(1)

html[data-pc-theme="cute"]
  .pc_page
    position: relative
    isolation: isolate
    min-height: 100vh
    width: 100%
    background: var(--pc-bg)
    color: var(--pc-text)
    font-size: 13px
    -webkit-font-smoothing: antialiased
    text-rendering: optimizeLegibility
    box-sizing: border-box
    ::selection
      background: var(--pc-select)
      color: var(--pc-text-bright)
  .pc_page_main
    position: relative
    z-index: 1
    width: 100%
    max-width: var(--pc-content-width)
    margin: 0 auto
    padding: 8px 26px 22px
  .pc_page_foot
    display: flex
    align-items: center
    justify-content: center
    flex-wrap: wrap
    gap: 7px
    padding: 18px 8px 2px
    color: var(--pc-faint)
    font-size: 11px
    letter-spacing: .2px
  .pc_foot_heart
    color: #f489b1
    font-size: 12px
    animation: pc_cute_pc_foot_beat 2.4s ease-in-out infinite
  .pc_foot_sep
    color: #e6c8d6
  @media (max-width: 1080px)
    .pc_page_main
      padding: 6px 20px 22px
  @media (max-width: 720px)
    .pc_page_main
      padding: 4px 12px 18px
    .pc_page_foot
      padding: 14px 4px 4px
      font-size: 10px
</style>

<style lang="sass">
// 像素混淆页的字体分两层，都不使用游戏字体。
// 方正兰亭圆（BAFJ_*）的 gasp 表在 9-24px 段没有灰度抗锯齿位，小字号会被
// 渲染成硬边，只适合 Blue Archive 相关页面。
//
// 标题层 = 资源圆体（思源黑体圆角化衍生，OFL 1.1），已按本页字符子集化，
//          见 assets/PixelConfusion/fonts/README.md。
@font-face
  font-family: "PixelConfusion Rounded"
  src: url("@/assets/PixelConfusion/fonts/pc-rounded-bold.woff2") format("woff2")
  font-weight: 700
  font-style: normal
  font-display: swap

:root
  // 屏幕 UI 字体：系统原生，11-13px 细字最清晰
  --pc-font-ui: "Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", "HarmonyOS Sans SC", "Segoe UI", system-ui, -apple-system, sans-serif
  // 标题圆体：只给 >=13px 的标题用；该字体无 hinting，更小的字号偏软
  --pc-font-round: "PixelConfusion Rounded", var(--pc-font-ui)

// 深色商务主题（默认）：7570a23 原版样式

html[data-pc-theme="dark"]
  // Tokens are shared with the preview modal, which is teleported to <body>
  // and therefore cannot inherit custom properties from .pc_page.
  .pc_page,
  .pc_preview_mask
    --pc-content-width: 1320px
    --pc-bg: #1e1f22
    --pc-surface: #25272a
    --pc-surface-alt: #2b2d30
    --pc-field: #1e1f22
    --pc-ink: #2f6bff
    --pc-text: #d7dae0
    --pc-text-bright: #f0f1f2
    --pc-muted: #8b9098
    --pc-faint: #666a70
    --pc-line: #3a3d41
    --pc-line-strong: #45484d
    --pc-select: #354968
    --pc-accent-hover: #3c76ff
    --pc-accent-border: #4279ff
    --pc-accent-light: #6ea4ff
    --pc-pink: #f2bd45
    --pc-rose: #ee2a7b
    --pc-rose-hover: #f4568f
    --pc-rose-border: #ff6aa5
    --pc-red: #e65b63
    font-family: var(--pc-font-ui)
  .pc_page,
  .pc_page *,
  .pc_page *::before,
  .pc_page *::after,
  .pc_preview_mask,
  .pc_preview_mask *,
  .pc_preview_mask *::before,
  .pc_preview_mask *::after
    box-sizing: border-box
  .pc_page .pc_card
    background: var(--pc-surface)
    border: 1px solid var(--pc-line)
    border-radius: 8px
    padding: 12px
    box-shadow: 0 1px 0 rgba(255, 255, 255, .025)

// 二次元主题：仅 html[data-pc-theme="cute"] 下生效

@keyframes pc_cute_pc_card_in
  0%
    opacity: 0
    transform: translateY(16px) scale(.985)
  100%
    opacity: 1
    transform: translateY(0) scale(1)

html[data-pc-theme="cute"]
  // 像素混淆主题变量：奶果风的奶油粉 + 樱粉 + 天空蓝
  // 预览弹窗通过 Teleport 挂到 body，因此变量需要在两处同时声明
  .pc_page,
  .pc_preview_mask
    --pc-content-width: 1340px
    --pc-bg: #fff7ef
    --pc-surface: rgba(255, 255, 255, .86)
    --pc-surface-alt: #fff6fa
    --pc-field: #fffaf5
    --pc-field-pink: #fff4f8
    --pc-ink: #ef6f9f
    --pc-ink-deep: #e85b8f
    --pc-ink-soft: #ffd6e6
    --pc-blue: #6aaee8
    --pc-blue-deep: #4f9ee0
    --pc-blue-soft: #d8ecff
    --pc-mint: #59c59a
    --pc-gold: #eba63f
    --pc-lav: #b39ddb
    --pc-text: #6e5765
    --pc-text-bright: #54414f
    --pc-muted: #9c8494
    --pc-faint: #b8a4b2
    --pc-line: #f8e2eb
    --pc-line-strong: #f2ccdc
    --pc-select: #ffe0ec
    --pc-accent-hover: #ff7fae
    --pc-accent-border: #ffc2d8
    --pc-accent-light: #ffb3d0
    --pc-rose: #f2588f
    --pc-rose-hover: #ff6f9f
    --pc-rose-border: #ffc2d8
    --pc-red: #e8697b
    --pc-warn: #e09a35
    --pc-radius: 24px
    --pc-radius-sm: 16px
    --pc-shadow: 0 16px 38px rgba(214, 146, 178, .2), 0 3px 10px rgba(214, 146, 178, .1), inset 0 2px 0 rgba(255, 255, 255, .95)
    --pc-shadow-soft: 0 8px 20px rgba(214, 146, 178, .16), inset 0 1px 0 rgba(255, 255, 255, .9)
    --pc-shadow-lift: 0 22px 46px rgba(214, 146, 178, .28), 0 4px 14px rgba(214, 146, 178, .14), inset 0 2px 0 #ffffff
    --pc-glow: 0 8px 22px rgba(239, 111, 159, .3)
    --pc-glow-blue: 0 8px 22px rgba(106, 174, 232, .3)
    font-family: var(--pc-font-ui)
  .pc_page,
  .pc_page *,
  .pc_page *::before,
  .pc_page *::after,
  .pc_preview_mask,
  .pc_preview_mask *,
  .pc_preview_mask *::before,
  .pc_preview_mask *::after
    box-sizing: border-box
  // 卡片基础样式：奶油白半透明 + 白色描边 + 柔粉阴影
  .pc_page .pc_card
    position: relative
    background: var(--pc-surface)
    border: 2px solid #ffffff
    border-radius: var(--pc-radius)
    padding: 14px
    box-shadow: var(--pc-shadow)
    transition: transform .35s cubic-bezier(.22, .9, .32, 1.2), box-shadow .35s ease, border-color .35s ease
  .pc_page .pc_workspace > .pc_card,
  .pc_page .pc_rail > .pc_card,
  .pc_page .pc_stage
    animation: pc_cute_pc_card_in .55s cubic-bezier(.22, .9, .32, 1.15) backwards
  .pc_page .pc_rail > .pc_card:nth-child(1)
    animation-delay: .05s
  .pc_page .pc_rail > .pc_card:nth-child(2)
    animation-delay: .12s
  .pc_page .pc_rail > .pc_card:nth-child(3)
    animation-delay: .19s
  .pc_page .pc_stage
    animation-delay: .16s
  // 侧栏卡片与来源卡片悬浮时轻轻抬起，像被捏了一下
  .pc_page .pc_rail > .pc_card:hover,
  .pc_page .pc_source_card:hover
    transform: translateY(-3px)
    box-shadow: var(--pc-shadow-lift)
    border-color: #ffffff
  .pc_page .pc_rail > .pc_card:hover::after,
  .pc_page .pc_source_card:hover::after
    opacity: 1
  .pc_page .pc_source_card::after
    content: ""
    position: absolute
    inset: -2px
    border-radius: inherit
    pointer-events: none
    opacity: 0
    transition: opacity .35s ease
    box-shadow: inset 0 0 0 2px rgba(255, 196, 218, .6)
  @media (prefers-reduced-motion: reduce)
    .pc_page .pc_card,
    .pc_page .pc_workspace > .pc_card,
    .pc_page .pc_rail > .pc_card,
    .pc_page .pc_stage
      animation: none
    .pc_page .pc_rail > .pc_card:hover,
    .pc_page .pc_source_card:hover
      transform: none
</style>
