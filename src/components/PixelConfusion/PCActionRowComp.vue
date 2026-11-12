<script setup lang="ts">
import { computed } from "vue";
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";

const store = usePCToolStore();
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
          class="pc_button pc_button_primary"
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
</style>
