<script setup lang="ts">
import PCAppBarComp from "@/components/PixelConfusion/PCAppBarComp.vue";
import PCResultPreviewComp from "@/components/PixelConfusion/PCResultPreviewComp.vue";
import PCWorkspaceComp from "@/components/PixelConfusion/PCWorkspaceComp.vue";
</script>

<template>
  <div class="pc_page">
    <PCAppBarComp/>
    <main class="pc_page_main">
      <PCWorkspaceComp/>
    </main>
    <PCResultPreviewComp/>
  </div>
</template>

<style scoped lang="sass">
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
</style>

<style lang="sass">
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
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", "Segoe UI", system-ui, -apple-system, sans-serif
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
</style>
