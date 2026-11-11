<script setup lang="ts">
import { computed } from "vue";
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import PCImageCanvasComp from "@/components/PixelConfusion/PCImageCanvasComp.vue";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";

const store = usePCToolStore();
const sourceCanvas = computed(() => store.source?.canvas ?? null);
const resultCanvas = computed(() => store.result?.canvas ?? null);
const progressPercent = computed(() => Math.round(store.progress * 100));

const pickIfEmpty = () => {
    if (!store.source && !store.busy) store.openImagePicker();
};
</script>

<template>
  <section class="pc_card pc_stage">
    <div class="pc_stage_head">
      <div class="pc_stage_title">
        <h2>预览</h2>
      </div>
      <div class="pc_stage_note">
        <PCIconComp name="info" :size="12" color="#666a70"/>
        <span>自动适配预览 · 输出保留原始尺寸</span>
      </div>
    </div>

    <div class="pc_stage_body">
      <div class="pc_preview_tile">
        <div class="pc_preview_head">
          <span class="pc_dot input"/>
          <span class="pc_preview_label">输入</span>
          <span class="pc_dims">{{ store.sourceDims }}</span>
        </div>
        <div
            class="pc_well"
            :class="{ has_image: !!sourceCanvas, clickable: !sourceCanvas && !store.busy }"
            @click="pickIfEmpty"
        >
          <PCImageCanvasComp v-if="sourceCanvas" :image="sourceCanvas" fit="contain"/>
          <div v-else class="pc_empty">
            <span class="pc_empty_icon">
              <PCIconComp name="image" :size="16" color="#8b9098"/>
            </span>
            <strong>还没有输入图片</strong>
            <span>选择图片或使用内置测试图</span>
            <button
                type="button"
                class="pc_empty_button"
                :disabled="store.busy"
                @click.stop="store.openImagePicker"
            >
              <PCIconComp name="image" :size="12" color="#d7dae0"/>
              选择图片
            </button>
          </div>
        </div>
      </div>

      <div class="pc_preview_tile">
        <div class="pc_preview_head">
          <span class="pc_dot output"/>
          <span class="pc_preview_label">结果</span>
          <span class="pc_dims">{{ store.resultDims }}</span>
        </div>
        <div
            class="pc_well"
            :class="{ has_image: !!resultCanvas || store.isTransforming, busy: store.isTransforming }"
        >
          <PCImageCanvasComp
              v-if="resultCanvas && !store.isTransforming"
              :image="resultCanvas"
              fit="contain"
          />
          <div v-if="store.isTransforming" class="pc_busy">
            <span class="pc_spinner"/>
            <strong>{{ store.busyLabel }}</strong>
            <span class="pc_busy_percent">{{ progressPercent }}%</span>
          </div>
          <div v-else-if="!resultCanvas" class="pc_empty">
            <span class="pc_empty_icon">
              <PCIconComp name="sparkles" :size="16" color="#8b9098"/>
            </span>
            <strong>结果会出现在这里</strong>
            <span>点击混淆或复原开始处理</span>
          </div>
        </div>
      </div>
    </div>

    <footer class="pc_stage_footer">
      <div class="pc_status_group">
        <span class="pc_status_dot" :class="`tone-${store.statusTone}`"/>
        <span
            class="pc_status_text"
            :class="{ error: store.statusTone === 'error' }"
            :title="store.statusText"
            aria-live="polite"
        >{{ store.statusText }}</span>
        <span class="pc_progress" aria-hidden="true">
          <i :style="{ width: `${progressPercent}%` }"/>
        </span>
        <span class="pc_local">本机</span>
      </div>
      <div class="pc_stage_actions">
        <button
            type="button"
            class="pc_small_button pc_small_secondary"
            :disabled="!store.canUseResult"
            @click="store.useResultAsSource"
        >
          <PCIconComp name="corner" :size="13"/>
          用作输入
        </button>
        <button
            type="button"
            class="pc_small_button pc_small_primary"
            :disabled="!store.canUseResult"
            @click="store.saveResult"
        >
          <PCIconComp name="download" :size="13"/>
          保存 PNG
        </button>
      </div>
    </footer>
  </section>
</template>

<style scoped lang="sass">
.pc_card.pc_stage
  min-height: 560px
  display: flex
  flex-direction: column
  padding-bottom: 0
.pc_stage_head
  min-height: 36px
  display: flex
  align-items: flex-start
  justify-content: space-between
  gap: 16px
  padding-bottom: 8px
.pc_stage_title
  h2
    margin: 0
    color: var(--pc-text)
    font-size: 13px
    font-weight: 700
.pc_stage_note
  display: inline-flex
  align-items: center
  gap: 5px
  color: var(--pc-faint)
  font-size: 10px
  line-height: 1.4
  white-space: nowrap
.pc_stage_body
  flex: 1
  min-height: 0
  display: grid
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)
  gap: 13px
  padding: 4px 0 8px
.pc_preview_tile
  min-width: 0
  min-height: 300px
  display: flex
  flex-direction: column
.pc_preview_head
  height: 18px
  display: flex
  align-items: center
  gap: 7px
  padding: 0 2px
.pc_dot
  width: 6px
  height: 6px
  border-radius: 50%
  flex: none
  &.input
    background: var(--pc-faint)
  &.output
    background: var(--pc-ink)
.pc_preview_label
  color: var(--pc-text)
  font-size: 12px
  font-weight: 700
.pc_dims
  margin-left: auto
  color: var(--pc-faint)
  font-size: 11px
  white-space: nowrap
.pc_well
  position: relative
  flex: 1
  min-height: 0
  margin-top: 8px
  padding: 16px
  border: 1px dashed var(--pc-line-strong)
  border-radius: 6px
  background: var(--pc-field)
  overflow: hidden
  &.has_image
    border-style: solid
    border-color: var(--pc-line)
  &.clickable
    cursor: pointer
  &.clickable:hover
    border-color: #5c6066
.pc_empty
  position: absolute
  inset: 0
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 4px
  padding: 16px
  box-sizing: border-box
  text-align: center
  pointer-events: none
  strong
    color: var(--pc-text)
    font-size: 12px
    font-weight: 700
  > span:not(.pc_empty_icon)
    color: var(--pc-muted)
    font-size: 11px
  .pc_empty_icon
    width: 38px
    height: 34px
    margin-bottom: 3px
    border: 1px solid var(--pc-line)
    border-radius: 8px
    background: var(--pc-surface-alt)
    display: inline-flex
    align-items: center
    justify-content: center
.pc_empty_button
  pointer-events: auto
  height: 28px
  margin-top: 7px
  padding: 0 11px
  border: 1px solid #4a4d52
  border-radius: 5px
  background: #35373b
  color: var(--pc-text)
  font-family: inherit
  font-size: 11px
  display: inline-flex
  align-items: center
  gap: 6px
  cursor: pointer
  transition: background .2s ease, border-color .2s ease
  &:hover:not(:disabled)
    background: #414449
    border-color: #5c6066
  &:disabled
    cursor: not-allowed
    opacity: .5
  &:focus-visible
    outline: 2px solid var(--pc-ink)
    outline-offset: 2px
.pc_busy
  position: absolute
  inset: 0
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 6px
  background: var(--pc-field)
  strong
    color: var(--pc-text)
    font-size: 12px
    font-weight: 700
.pc_spinner
  width: 34px
  height: 34px
  border-radius: 50%
  border: 2px solid var(--pc-line-strong)
  border-top-color: var(--pc-ink)
  border-right-color: var(--pc-accent-light)
  animation: pc_spin .8s linear infinite
.pc_busy_percent
  color: var(--pc-faint)
  font-size: 11px
@keyframes pc_spin
  to
    transform: rotate(360deg)
.pc_stage_footer
  margin: 0 -12px
  padding: 0 12px
  min-height: 56px
  border-top: 1px solid var(--pc-line)
  display: flex
  align-items: center
  justify-content: space-between
  gap: 12px
.pc_status_group
  min-width: 0
  display: flex
  align-items: center
  gap: 7px
.pc_status_dot
  width: 7px
  height: 7px
  border-radius: 50%
  background: var(--pc-faint)
  flex: none
  &.tone-ok
    background: #4d8df7
  &.tone-busy
    background: var(--pc-pink)
  &.tone-error
    background: var(--pc-red)
.pc_status_text
  min-width: 0
  max-width: 300px
  color: var(--pc-muted)
  font-size: 11px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  &.error
    color: var(--pc-red)
.pc_progress
  width: 68px
  height: 3px
  margin-left: 3px
  border-radius: 2px
  background: var(--pc-line)
  overflow: hidden
  flex: none
  i
    display: block
    height: 100%
    border-radius: inherit
    background: var(--pc-ink)
    transition: width .2s ease
.pc_local
  color: var(--pc-faint)
  font-size: 10px
  flex: none
.pc_stage_actions
  display: flex
  align-items: center
  gap: 7px
  flex: none
.pc_small_button
  height: 30px
  padding: 0 11px
  border-radius: 5px
  border: 1px solid transparent
  font-family: inherit
  font-size: 11px
  font-weight: 700
  display: inline-flex
  align-items: center
  gap: 6px
  cursor: pointer
  transition: background .2s ease, border-color .2s ease, opacity .2s ease
  &:disabled
    cursor: not-allowed
    background: var(--pc-surface-alt)
    border-color: var(--pc-line)
    color: #686c72
  &:focus-visible
    outline: 2px solid var(--pc-ink)
    outline-offset: 2px
.pc_small_secondary
  background: #35373b
  border-color: #4a4d52
  color: var(--pc-text)
  &:hover:not(:disabled)
    background: #414449
    border-color: #5c6066
.pc_small_primary
  background: var(--pc-ink)
  border-color: var(--pc-accent-border)
  color: #ffffff
  &:hover:not(:disabled)
    background: var(--pc-accent-hover)
    border-color: var(--pc-accent-light)
@media (max-width: 720px)
  .pc_stage_head
    flex-direction: column
    gap: 6px
  .pc_well
    padding: 12px
  .pc_stage_body
    grid-template-columns: minmax(0, 1fr)
  .pc_preview_tile
    min-height: 240px
  .pc_stage_footer
    flex-wrap: wrap
    padding-top: 8px
    padding-bottom: 8px
  .pc_status_text
    max-width: 180px
  .pc_stage_actions
    margin-left: auto
</style>
