<script setup lang="ts">
import { computed } from "vue";
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import PCToggleComp from "@/components/PixelConfusion/PCToggleComp.vue";
import type { PCIterationMode } from "@/interfaces/PixelConfusionImpl";
import { usePCTheme } from "@/composables/usePCTheme";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";
import { MAX_BATCH_COUNT } from "@/utils/PixelConfusion/parameters";

const store = usePCToolStore();
const { isCute } = usePCTheme();

const isBatch = computed(() => store.iterationMode === "batch");
const canNext = computed(() =>
    isBatch.value
    && !store.autoMixed
    && store.batchHasResults
    && store.canNextBatch
    && !store.busy
);

const selectMode = (mode: PCIterationMode) => {
    store.setIterationMode(mode);
};

const onAutoChange = (value: boolean) => {
    store.setAutoMixed(value);
};

const onCountInput = (event: Event) => {
    const target = event.target as HTMLInputElement | null;
    if (target) store.setBatchCountText(target.value);
};
</script>

<template>
  <section class="pc_card pc_iteration_card">
    <div class="pc_card_head">
      <h2>迭代方式</h2>
    </div>

    <div class="pc_segmented" role="group" aria-label="迭代方式">
      <button
          type="button"
          class="pc_segment"
          :class="{ active: store.iterationMode === 'single' }"
          :disabled="store.busy"
          :aria-pressed="store.iterationMode === 'single'"
          @click="selectMode('single')"
      >
        <PCIconComp name="rotate" :size="13"/>
        单次
      </button>
      <button
          type="button"
          class="pc_segment"
          :class="{ active: store.iterationMode === 'batch' }"
          :disabled="store.busy"
          :aria-pressed="store.iterationMode === 'batch'"
          @click="selectMode('batch')"
      >
        <PCIconComp name="grid" :size="13"/>
        多次
      </button>
    </div>

    <Transition name="pc_fade_soft" mode="out-in">
      <p v-if="!isBatch" key="single" class="pc_mode_hint">
        {{ isCute ? "一张一张慢慢来，保持当前的单张处理流程。" : "保持当前的单张处理流程。" }}
      </p>

      <div v-else key="batch" class="pc_batch_block">
        <p class="pc_mode_hint">从第 1 次开始，每批生成 N 张结果</p>

        <div class="pc_count_head">
          <label class="pc_field_label" for="pc_batch_count">等差迭代次数</label>
          <span class="pc_field_aside">1–{{ MAX_BATCH_COUNT }}</span>
        </div>
        <div class="pc_stepper">
          <button
              type="button"
              class="pc_stepper_button"
              title="减少次数"
              aria-label="减少等差迭代次数"
              :disabled="store.busy"
              @click="store.stepBatchCount(-1)"
          >
            <PCIconComp name="minus" :size="14"/>
          </button>
          <input
              id="pc_batch_count"
              :value="store.batchCountText"
              class="pc_stepper_input"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              spellcheck="false"
              :disabled="store.busy"
              aria-label="等差迭代次数"
              @input="onCountInput"
          />
          <button
              type="button"
              class="pc_stepper_button"
              title="增加次数"
              aria-label="增加等差迭代次数"
              :disabled="store.busy"
              @click="store.stepBatchCount(1)"
          >
            <PCIconComp name="plus" :size="14"/>
          </button>
        </div>
        <Transition name="pc_fade_soft">
          <p v-if="store.batchCountInvalid" class="pc_count_error">
            {{ store.batchCountInvalid }}
          </p>
        </Transition>

        <PCToggleComp
            class="pc_auto_toggle"
            :model-value="store.autoMixed"
            label="正反自动混淆"
            :disabled="store.busy"
            @update:model-value="onAutoChange"
        />

        <div v-if="!store.autoMixed" class="pc_next_block">
          <button
              type="button"
              class="pc_next_button"
              :disabled="!canNext"
              @click="store.runNextBatch"
          >
            <PCIconComp name="arrow-right" :size="14"/>
            下一批
          </button>
          <p class="pc_next_meta">{{ store.nextBatchMeta }}</p>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped lang="sass">
.pc_iteration_card
  display: flex
  flex-direction: column
.pc_card_head
  min-height: 18px
  display: flex
  align-items: center
  h2
    display: inline-flex
    align-items: center
    gap: 7px
    margin: 0
    color: var(--pc-text-bright)
    font-family: "BAFJ_CU", "Microsoft YaHei UI", sans-serif
    font-size: 14px
    font-weight: 700
    letter-spacing: .5px
    &::before
      content: ""
      width: 5px
      height: 15px
      border-radius: 999px
      background: linear-gradient(180deg, #ffb3cf, #ef6f9f)
      box-shadow: 0 2px 6px rgba(239, 111, 159, .35)
.pc_segmented
  margin-top: 12px
  height: 42px
  padding: 4px
  background: linear-gradient(135deg, #fff3f8, #ffeef5)
  border: 1px solid #ffe4ee
  border-radius: 999px
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 4px
.pc_segment
  min-width: 0
  height: 32px
  border: 2px solid transparent
  border-radius: 999px
  background: transparent
  color: var(--pc-muted)
  font-family: inherit
  font-size: 12px
  font-weight: 700
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 6px
  cursor: pointer
  transition: background .3s ease, border-color .3s ease, color .3s ease, box-shadow .3s ease, transform .25s ease
  &:hover:not(:disabled):not(.active)
    color: var(--pc-text)
    background: rgba(255, 255, 255, .65)
  &.active
    color: var(--pc-ink-deep)
    background: #ffffff
    border-color: #ffffff
    box-shadow: 0 5px 14px rgba(240, 112, 158, .22), inset 0 1px 0 #ffffff
    transform: translateY(-1px)
  &:disabled
    cursor: not-allowed
    opacity: .5
  &:focus-visible
    outline: 3px solid rgba(239, 111, 159, .3)
    outline-offset: 2px
.pc_mode_hint
  margin: 10px 0 0
  color: var(--pc-muted)
  font-size: 11px
  line-height: 1.55
.pc_batch_block
  display: flex
  flex-direction: column
.pc_count_head
  margin-top: 12px
  display: flex
  align-items: baseline
  justify-content: space-between
  gap: 8px
.pc_field_label
  color: var(--pc-muted)
  font-size: 11px
  font-weight: 700
  line-height: 1.4
.pc_field_aside
  color: var(--pc-faint)
  font-size: 10px
.pc_stepper
  margin-top: 5px
  height: 40px
  display: grid
  grid-template-columns: 40px minmax(0, 1fr) 40px
  background: #ffffff
  border: 2px solid #f8e2eb
  border-radius: 16px
  overflow: hidden
  box-shadow: inset 0 2px 5px rgba(214, 146, 178, .07)
  transition: border-color .3s ease, box-shadow .3s ease
  &:focus-within
    border-color: #f7a8c6
    box-shadow: 0 0 0 4px rgba(239, 111, 159, .13)
.pc_stepper_button
  border: 0
  background: transparent
  display: inline-flex
  align-items: center
  justify-content: center
  cursor: pointer
  color: var(--pc-ink-deep)
  transition: background .25s ease, transform .2s ease
  &:hover:not(:disabled)
    background: #fff0f6
  &:active:not(:disabled)
    transform: scale(.88)
  &:disabled
    cursor: not-allowed
    opacity: .4
  &:focus-visible
    outline: 3px solid rgba(239, 111, 159, .3)
    outline-offset: -4px
.pc_stepper_input
  width: 100%
  min-width: 0
  border: 0
  background: transparent
  color: var(--pc-text-bright)
  text-align: center
  font-family: inherit
  font-size: 13px
  font-weight: 700
  outline: none
  padding: 0
  &::selection
    background: var(--pc-select)
.pc_count_error
  margin: 6px 0 0
  color: var(--pc-red)
  font-size: 10px
  line-height: 1.4
.pc_auto_toggle
  margin-top: 8px
.pc_next_block
  margin-top: 8px
.pc_next_button
  width: 100%
  height: 40px
  border-radius: 999px
  border: 2px solid #ffffff
  background: linear-gradient(135deg, #a8d8ff 0%, #6aaee8 62%, #5aa3e4 100%)
  color: #ffffff
  font-family: inherit
  font-size: 12.5px
  font-weight: 700
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 7px
  cursor: pointer
  box-shadow: var(--pc-glow-blue), inset 0 1px 0 rgba(255, 255, 255, .55)
  transition: transform .28s cubic-bezier(.34, 1.56, .64, 1), box-shadow .28s ease, filter .28s ease, background .28s ease
  &:hover:not(:disabled)
    transform: translateY(-2px)
    filter: brightness(1.04)
    box-shadow: 0 12px 26px rgba(106, 174, 232, .4), inset 0 1px 0 rgba(255, 255, 255, .6)
  &:active:not(:disabled)
    transform: translateY(0) scale(.98)
  &:disabled
    cursor: not-allowed
    background: #f8edf2
    border-color: #ffffff
    color: #cbb6c2
    box-shadow: none
  &:focus-visible
    outline: 3px solid rgba(106, 174, 232, .35)
    outline-offset: 2px
.pc_next_meta
  margin: 6px 0 0
  color: var(--pc-faint)
  font-size: 10px
  line-height: 1.4
.pc_fade_soft-enter-active,
.pc_fade_soft-leave-active
  transition: opacity .25s ease, transform .25s ease
.pc_fade_soft-enter-from,
.pc_fade_soft-leave-to
  opacity: 0
  transform: translateY(-4px)
@media (prefers-reduced-motion: reduce)
  .pc_fade_soft-enter-active,
  .pc_fade_soft-leave-active
    transition: none
// =====================================================================
// 深色商务主题（默认）：html[data-pc-theme="dark"] 下恢复原版暗色样式
// =====================================================================
html[data-pc-theme="dark"]

    .pc_iteration_card
      display: flex
      flex-direction: column
    .pc_card_head
      min-height: 16px
      h2
        margin: 0
        color: var(--pc-text)
        font-size: 13px
        font-weight: 700
    .pc_segmented
      margin-top: 12px
      height: 38px
      padding: 4px
      box-sizing: border-box
      background: var(--pc-field)
      border: 1px solid var(--pc-line-strong)
      border-radius: 6px
      display: grid
      grid-template-columns: 1fr 1fr
      gap: 4px
    .pc_segment
      min-width: 0
      height: 28px
      border: 1px solid transparent
      border-radius: 4px
      background: transparent
      color: var(--pc-muted)
      font-size: 12px
      display: inline-flex
      align-items: center
      justify-content: center
      gap: 6px
      cursor: pointer
      transition: background .2s ease, border-color .2s ease, color .2s ease
      &:hover:not(:disabled):not(.active)
        color: var(--pc-text)
        background: rgba(255, 255, 255, .035)
      &.active
        color: var(--pc-text-bright)
        font-weight: 700
        background: var(--pc-select)
        border-color: #47709f
        box-shadow: none
        transform: none
      &:hover:not(:disabled):not(.active)
        transform: none
      &:disabled
        cursor: not-allowed
        opacity: .5
      &:focus-visible
        outline: 2px solid var(--pc-ink)
        outline-offset: 2px
    .pc_mode_hint
      margin: 10px 0 0
      color: var(--pc-faint)
      font-size: 11px
      line-height: 1.5
    .pc_batch_block
      display: flex
      flex-direction: column
    .pc_count_head
      margin-top: 12px
      display: flex
      align-items: baseline
      justify-content: space-between
      gap: 8px
    .pc_field_label
      color: var(--pc-muted)
      font-size: 11px
      line-height: 1.4
    .pc_field_aside
      color: var(--pc-faint)
      font-size: 10px
    .pc_stepper
      margin-top: 4px
      height: 36px
      box-sizing: border-box
      display: grid
      grid-template-columns: 36px minmax(0, 1fr) 36px
      background: var(--pc-field)
      border: 1px solid var(--pc-line-strong)
      border-radius: 5px
      overflow: hidden
      box-shadow: none
      &:focus-within
        border-color: var(--pc-ink)
        box-shadow: none
    .pc_stepper_button
      border: 0
      background: transparent
      display: inline-flex
      align-items: center
      justify-content: center
      cursor: pointer
      color: var(--pc-muted)
      transition: background .2s ease
      &:hover:not(:disabled)
        background: #35373b
      &:active:not(:disabled)
        transform: none
      &:disabled
        cursor: not-allowed
        opacity: .4
      &:focus-visible
        outline: 2px solid var(--pc-ink)
        outline-offset: -3px
    .pc_stepper_input
      width: 100%
      min-width: 0
      border: 0
      background: transparent
      color: var(--pc-text)
      text-align: center
      font-family: inherit
      font-size: 12px
      outline: none
      padding: 0
      &::selection
        background: var(--pc-select)
    .pc_count_error
      margin: 6px 0 0
      color: var(--pc-red)
      font-size: 10px
      line-height: 1.4
    .pc_auto_toggle
      margin-top: 8px
    .pc_next_block
      margin-top: 8px
    .pc_next_button
      width: 100%
      height: 38px
      border-radius: 5px
      border: 1px solid var(--pc-accent-border)
      background: var(--pc-ink)
      color: #ffffff
      font-family: inherit
      font-size: 12px
      font-weight: 700
      display: inline-flex
      align-items: center
      justify-content: center
      gap: 7px
      cursor: pointer
      box-shadow: none
      transition: background .2s ease, border-color .2s ease, opacity .2s ease
      &:hover:not(:disabled)
        background: var(--pc-accent-hover)
        border-color: var(--pc-accent-light)
        transform: none
        filter: none
        box-shadow: none
      &:active:not(:disabled)
        transform: none
      &:disabled
        cursor: not-allowed
        background: var(--pc-surface-alt)
        border-color: var(--pc-line)
        color: #686c72
      &:focus-visible
        outline: 2px solid var(--pc-ink)
        outline-offset: 2px
    .pc_next_meta
      margin: 6px 0 0
      color: var(--pc-faint)
      font-size: 10px
      line-height: 1.4
</style>
