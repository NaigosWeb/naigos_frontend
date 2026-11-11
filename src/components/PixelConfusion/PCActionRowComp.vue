<script setup lang="ts">
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";

const store = usePCToolStore();
</script>

<template>
  <div class="pc_action_row">
    <button
        type="button"
        class="pc_button pc_button_primary"
        :disabled="!store.canTransform"
        @click="store.runTransform('scramble')"
    >
      <PCIconComp name="shuffle" :size="15"/>
      混淆图片
    </button>
    <button
        type="button"
        class="pc_button pc_button_secondary"
        :disabled="!store.canTransform"
        @click="store.runTransform('restore')"
    >
      <PCIconComp name="rotate" :size="15"/>
      复原图片
    </button>
  </div>
</template>

<style scoped lang="sass">
.pc_action_row
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 8px
.pc_button
  height: 38px
  border-radius: 5px
  border: 1px solid transparent
  font-family: inherit
  font-size: 12px
  font-weight: 700
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 7px
  cursor: pointer
  transition: background .2s ease, border-color .2s ease, opacity .2s ease, box-shadow .2s ease
  &:disabled
    cursor: not-allowed
    background: var(--pc-surface-alt)
    border-color: var(--pc-line)
    color: #686c72
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
.pc_button_secondary
  background: #35373b
  border-color: #4a4d52
  color: var(--pc-text)
  &:hover:not(:disabled)
    background: #414449
    border-color: #5c6066
</style>
