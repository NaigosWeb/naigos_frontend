<script setup lang="ts">
import { computed } from "vue";
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";
import { usePCTheme } from "@/composables/usePCTheme";

const store = usePCToolStore();
const { isCute } = usePCTheme();
const showAuto = computed(() =>
    store.iterationMode === "batch" && store.autoMixed);
const canAuto = computed(() => store.canRunAutoBatch);
const canAutoNext = computed(() => store.canRunAutoNextBatch);
</script>

<template>
  <div class="pc_action_row">
    <template v-if="showAuto">
      <button
          type="button"
          class="pc_button pc_button_primary"
          :disabled="!canAuto"
          @click="store.runAutoBatch"
      >
        <PCIconComp name="shuffle" :size="15"/>
        自动混淆
      </button>
      <button
          type="button"
          class="pc_button pc_button_primary"
          :disabled="!canAutoNext"
          @click="store.runAutoNextBatch"
      >
        <PCIconComp name="arrow-right" :size="15"/>
        自动下一批混淆
      </button>
    </template>
    <template v-else>
      <button
          type="button"
          :class="['pc_button', isCute ? 'pc_button_blue' : 'pc_button_primary']"
          :disabled="!store.canTransform"
          @click="store.runDirection('restore')"
      >
        <PCIconComp name="arrow-left" :size="15"/>
        反向混淆
      </button>
      <button
          type="button"
          class="pc_button pc_button_rose"
          :disabled="!store.canTransform"
          @click="store.runDirection('scramble')"
      >
        <PCIconComp name="arrow-right" :size="15"/>
        正向混淆
      </button>
    </template>
  </div>
</template>

<style scoped lang="sass">
// 深色商务主题（默认）：7570a23 原版样式

html[data-pc-theme="dark"]
  .pc_action_row
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 8px
  .pc_button
    min-width: 0
    height: 38px
    padding: 0 8px
    border-radius: 5px
    border: 1px solid transparent
    font-family: inherit
    font-size: 12px
    font-weight: 700
    display: inline-flex
    align-items: center
    justify-content: center
    gap: 7px
    white-space: nowrap
    cursor: pointer
    transition: background .2s ease, border-color .2s ease, opacity .2s ease, box-shadow .2s ease
    &:disabled
      cursor: not-allowed
      background: var(--pc-surface-alt)
      border-color: var(--pc-line)
      color: #686c72
      box-shadow: none
    &:focus-visible
      outline: 2px solid var(--pc-ink)
      outline-offset: 2px
  .pc_button_primary
    background: var(--pc-ink)
    border-color: var(--pc-accent-border)
    color: #ffffff
    box-shadow: 0 4px 14px rgba(47, 107, 255, .18)
    &:hover:not(:disabled)
      background: var(--pc-accent-hover)
      border-color: var(--pc-accent-light)
  .pc_button_rose
    background: var(--pc-rose)
    border-color: var(--pc-rose-border)
    color: #ffffff
    box-shadow: 0 4px 14px rgba(238, 42, 123, .16)
    &:hover:not(:disabled)
      background: var(--pc-rose-hover)
      border-color: var(--pc-rose-border)

// 二次元主题：仅 html[data-pc-theme="cute"] 下生效

html[data-pc-theme="cute"]
  .pc_action_row
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 10px
  .pc_button
    position: relative
    min-width: 0
    height: 42px
    padding: 0 8px
    border-radius: 999px
    border: 2px solid #ffffff
    font-family: inherit
    font-size: 12.5px
    font-weight: 700
    letter-spacing: .3px
    display: inline-flex
    align-items: center
    justify-content: center
    gap: 7px
    white-space: nowrap
    cursor: pointer
    overflow: hidden
    transition: transform .28s cubic-bezier(.34, 1.56, .64, 1), box-shadow .28s ease, filter .28s ease, background .28s ease
    &::after
      content: ""
      position: absolute
      top: -60%
      left: -35%
      width: 32%
      height: 220%
      background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, .55), rgba(255, 255, 255, 0))
      transform: rotate(18deg) translateX(-160%)
      transition: transform .65s ease
      pointer-events: none
    &:hover:not(:disabled)
      transform: translateY(-2px)
      filter: brightness(1.03)
      &::after
        transform: rotate(18deg) translateX(480%)
    &:active:not(:disabled)
      transform: translateY(0) scale(.97)
    &:disabled
      cursor: not-allowed
      background: #f8edf2
      border-color: #ffffff
      color: #cbb6c2
      box-shadow: none
      &::after
        display: none
    &:focus-visible
      outline: 3px solid rgba(239, 111, 159, .35)
      outline-offset: 2px
  .pc_button_primary
    background: linear-gradient(135deg, #ffb3cf 0%, #f0709e 55%, #e85b8f 100%)
    color: #ffffff
    box-shadow: var(--pc-glow), inset 0 1px 0 rgba(255, 255, 255, .55)
    &:hover:not(:disabled)
      box-shadow: 0 12px 26px rgba(239, 111, 159, .4), inset 0 1px 0 rgba(255, 255, 255, .6)
  .pc_button_blue
    background: linear-gradient(135deg, #a8d8ff 0%, #6aaee8 62%, #5aa3e4 100%)
    color: #ffffff
    box-shadow: var(--pc-glow-blue), inset 0 1px 0 rgba(255, 255, 255, .55)
    &:hover:not(:disabled)
      box-shadow: 0 12px 26px rgba(106, 174, 232, .4), inset 0 1px 0 rgba(255, 255, 255, .6)
    &:focus-visible
      outline-color: rgba(106, 174, 232, .4)
  .pc_button_rose
    background: linear-gradient(135deg, #ffa6c6 0%, #f2588f 62%, #ea4b84 100%)
    color: #ffffff
    box-shadow: 0 8px 22px rgba(242, 88, 143, .32), inset 0 1px 0 rgba(255, 255, 255, .5)
    &:hover:not(:disabled)
      box-shadow: 0 12px 26px rgba(242, 88, 143, .42), inset 0 1px 0 rgba(255, 255, 255, .55)
  @media (max-width: 720px)
    .pc_button
      font-size: 12px
  @media (prefers-reduced-motion: reduce)
    .pc_button,
    .pc_button::after
      transition: none
</style>
