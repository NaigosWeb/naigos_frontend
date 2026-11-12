<script setup lang="ts">
import { computed } from "vue";
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";
import type { PCMethod } from "@/interfaces/PixelConfusionImpl";

const store = usePCToolStore();
const isGilbert = computed(() => store.method === "gilbert");
const isBatch = computed(() => store.iterationMode === "batch");
const methodDescription = computed(() => store.methodDescription);

const selectMethod = (value: PCMethod) => {
    store.changeMethod(value);
};
</script>

<template>
  <section class="pc_card pc_params_card" :class="{ batch: isBatch }">
    <div class="pc_card_head">
      <h2>算法与参数</h2>
    </div>

    <div class="pc_segmented" role="group" aria-label="算法选择">
      <button
          type="button"
          class="pc_segment"
          :class="{ active: store.method === 'gilbert' }"
          :disabled="store.busy"
          :aria-pressed="store.method === 'gilbert'"
          @click="selectMethod('gilbert')"
      >
        <PCIconComp name="route" :size="13"/>
        Gilbert
      </button>
      <button
          type="button"
          class="pc_segment"
          :class="{ active: store.method === 'arnold' }"
          :disabled="store.busy"
          :aria-pressed="store.method === 'arnold'"
          @click="selectMethod('arnold')"
      >
        <PCIconComp name="grid" :size="13"/>
        Arnold
      </button>
    </div>

    <p class="pc_method_desc" :class="{ warning: methodDescription.warning }">
      {{ methodDescription.text }}
    </p>

    <div v-if="!isBatch">
      <label class="pc_field_label" for="pc_iterations">迭代次数</label>
      <div class="pc_stepper">
        <button
            type="button"
            class="pc_stepper_button"
            title="减少次数"
            aria-label="减少次数"
            :disabled="store.busy"
            @click="store.stepIterations(-1)"
        >
          <PCIconComp name="minus" :size="14"/>
        </button>
        <input
            id="pc_iterations"
            v-model="store.iterations"
            class="pc_stepper_input"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            spellcheck="false"
            :disabled="store.busy"
            aria-label="迭代次数"
        />
        <button
            type="button"
            class="pc_stepper_button"
            title="增加次数"
            aria-label="增加次数"
            :disabled="store.busy"
            @click="store.stepIterations(1)"
        >
          <PCIconComp name="plus" :size="14"/>
        </button>
      </div>
    </div>

    <div v-if="isGilbert" class="pc_field_block">
      <div class="pc_field_head">
        <label class="pc_field_label" for="pc_offset">偏移量</label>
        <span class="pc_field_aside">留空自动</span>
      </div>
      <input
          id="pc_offset"
          v-model="store.offset"
          class="pc_field"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          spellcheck="false"
          placeholder="黄金比"
          :disabled="store.busy"
      />
    </div>

    <div v-else class="pc_ab_grid">
      <div class="pc_field_block">
        <label class="pc_field_label" for="pc_param_a">参数 a</label>
        <input
            id="pc_param_a"
            v-model="store.paramA"
            class="pc_field"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            spellcheck="false"
            :disabled="store.busy"
        />
      </div>
      <div class="pc_field_block">
        <label class="pc_field_label" for="pc_param_b">参数 b</label>
        <input
            id="pc_param_b"
            v-model="store.paramB"
            class="pc_field"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            spellcheck="false"
            :disabled="store.busy"
        />
      </div>
    </div>

    <div class="pc_hint">
      <PCIconComp name="info" :size="13" color="#8b9098"/>
      <span>{{ store.methodHint }}</span>
    </div>
  </section>
</template>

<style scoped lang="sass">
.pc_params_card
  min-height: 360px
  display: flex
  flex-direction: column
  &.batch
    min-height: 270px
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
  &:disabled
    cursor: not-allowed
    opacity: .5
  &:focus-visible
    outline: 2px solid var(--pc-ink)
    outline-offset: 2px
.pc_method_desc
  min-height: 18px
  margin: 8px 0 0
  color: var(--pc-muted)
  font-size: 11px
  line-height: 1.5
  &.warning
    color: var(--pc-pink)
.pc_field_label
  display: block
  color: var(--pc-muted)
  font-size: 11px
  line-height: 1.4
  margin-top: 12px
.pc_field_head
  display: flex
  align-items: baseline
  justify-content: space-between
  gap: 8px
  .pc_field_label
    margin-top: 12px
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
  &:focus-within
    border-color: var(--pc-ink)
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
.pc_ab_grid
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 8px
.pc_field_block
  min-width: 0
.pc_field
  width: 100%
  height: 36px
  box-sizing: border-box
  margin-top: 4px
  padding: 0 10px
  background: var(--pc-field)
  border: 1px solid var(--pc-line-strong)
  border-radius: 5px
  color: var(--pc-text)
  font-family: inherit
  font-size: 12px
  outline: none
  transition: border-color .2s ease
  &::placeholder
    color: var(--pc-faint)
  &:focus
    border-color: var(--pc-ink)
  &:disabled
    color: #686c72
    background: var(--pc-surface-alt)
    cursor: not-allowed
.pc_hint
  margin-top: 12px
  padding: 9px 10px
  background: var(--pc-field)
  border: 1px solid var(--pc-line)
  border-radius: 6px
  display: flex
  align-items: flex-start
  gap: 8px
  color: var(--pc-muted)
  font-size: 11px
  line-height: 1.55
  span
    min-width: 0
@media (max-width: 1080px)
  .pc_params_card
    min-height: 0
</style>
