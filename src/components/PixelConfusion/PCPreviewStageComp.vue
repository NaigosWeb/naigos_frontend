<script setup lang="ts">
import { computed } from "vue";
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import PCImageCanvasComp from "@/components/PixelConfusion/PCImageCanvasComp.vue";
import PCResultPaneComp from "@/components/PixelConfusion/PCResultPaneComp.vue";
import type { PCBatchItemImpl } from "@/interfaces/PixelConfusionImpl";
import { usePCTheme } from "@/composables/usePCTheme";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";

const store = usePCToolStore();
const { isCute } = usePCTheme();

const sourceCanvas = computed(() => store.source?.canvas ?? null);
const resultCanvas = computed(() => store.result?.canvas ?? null);
const progressPercent = computed(() => Math.round(store.progress * 100));

const headHint = computed(() => {
    if (store.stageMode === "single") {
        return "自动适配预览 · 输出保留原始尺寸";
    }
    if (store.stageMode === "auto") {
        return "正反结果集同步显示 · 点击缩略图放大预览";
    }
    return "整批结果集 · 点击缩略图放大预览";
});

const canOpenResults = computed(() => !store.busy);

const pickIfEmpty = () => {
    if (!store.source && !store.busy) store.openImagePicker();
};

const openItem = (item: PCBatchItemImpl) => {
    void store.openBatchPreview(item);
};
</script>

<template>
  <section class="pc_card pc_stage">
    <div class="pc_stage_head">
      <div class="pc_stage_title">
        <h2>预览</h2>
      </div>
      <div class="pc_stage_note">
        <PCIconComp name="info" :size="12" :color="isCute ? 'var(--pc-ink)' : 'var(--pc-faint)'"/>
        <span>{{ headHint }}</span>
      </div>
    </div>

    <div class="pc_stage_body" :class="`mode-${store.stageMode}`">
      <div v-if="store.stageMode !== 'auto'" class="pc_preview_tile">
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
              <PCIconComp name="image" :size="isCute ? 17 : 16" :color="isCute ? 'var(--pc-ink)' : '#8b9098'"/>
            </span>
            <strong>{{ isCute ? "还没有放图片进来呢" : "还没有输入图片" }}</strong>
            <span>{{ isCute ? "选一张图片，或试试内置测试图" : "选择图片或使用内置测试图" }}</span>
            <button
                type="button"
                class="pc_empty_button"
                :disabled="store.busy"
                @click.stop="store.openImagePicker"
            >
              <PCIconComp name="image" :size="12" :color="isCute ? '#ffffff' : '#d7dae0'"/>
              选择图片
            </button>
          </div>
        </div>
      </div>

      <div v-if="store.stageMode === 'single'" class="pc_preview_tile">
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
              <PCIconComp name="sparkles" :size="isCute ? 17 : 16" :color="isCute ? 'var(--pc-rose)' : '#8b9098'"/>
            </span>
            <strong>{{ isCute ? "结果会在这里冒出来" : "结果会出现在这里" }}</strong>
            <span>点击正向混淆或反向混淆开始处理</span>
          </div>
        </div>
      </div>

      <PCResultPaneComp
          v-else-if="store.stageMode === 'batch'"
          :pane="store.primaryPane"
          :disabled="!canOpenResults"
          @open="openItem"
      />

      <template v-else>
        <PCResultPaneComp
            :pane="store.reversePane"
            :disabled="!canOpenResults"
            @open="openItem"
        />
        <PCResultPaneComp
            :pane="store.forwardPane"
            :disabled="!canOpenResults"
            @open="openItem"
        />
      </template>
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

      <div v-if="store.stageMode === 'single'" class="pc_stage_actions">
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
      <div v-else class="pc_batch_hint">
        点击结果可预览 · 保存 · 用作输入
      </div>
    </footer>
  </section>
</template>

<style scoped lang="sass">
// 深色商务主题（默认）：7570a23 原版样式

@keyframes pc_spin
  to
    transform: rotate(360deg)

html[data-pc-theme="dark"]
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
    max-width: 320px
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
  .pc_batch_hint
    color: var(--pc-faint)
    font-size: 10px
    white-space: nowrap
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
  @media (max-width: 1080px)
    .pc_stage_body
      grid-template-columns: minmax(0, 1fr)
    .pc_preview_tile
      min-height: 0
    // Without a viewport-bounded stage the well has no definite height, so the
    // canvas would fall back to its intrinsic pixel height.
    .pc_well
      flex: none
      height: min(46vh, 420px)
  @media (max-width: 720px)
    .pc_stage_head
      flex-direction: column
      gap: 6px
    .pc_well
      padding: 12px
      height: min(42vh, 340px)
    .pc_preview_tile
      min-height: 0
    .pc_stage_footer
      flex-wrap: wrap
      padding-top: 8px
      padding-bottom: 8px
    .pc_status_text
      max-width: 180px
    .pc_batch_hint
      margin-left: auto

// 二次元主题：仅 html[data-pc-theme="cute"] 下生效

@keyframes pc_cute_pc_spin
  to
    transform: rotate(360deg)

@keyframes pc_cute_pc_dot_pulse
  0%, 100%
    box-shadow: 0 0 0 0 rgba(239, 111, 159, .32)
  60%
    box-shadow: 0 0 0 5px rgba(239, 111, 159, 0)

@keyframes pc_cute_pc_shimmer
  0%
    transform: translateX(-120%)
  60%, 100%
    transform: translateX(220%)

@keyframes pc_cute_pc_busy_float
  0%, 100%
    transform: translateY(0)
  50%
    transform: translateY(-3px)

html[data-pc-theme="cute"]
  .pc_card.pc_stage
    min-height: 560px
    display: flex
    flex-direction: column
    padding: 14px 14px 0
    overflow: hidden
  .pc_stage_head
    min-height: 38px
    display: flex
    align-items: flex-start
    justify-content: space-between
    gap: 16px
    padding-bottom: 8px
  .pc_stage_title
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
        background: linear-gradient(180deg, #ffc2d8, #f2588f)
        box-shadow: 0 2px 6px rgba(242, 88, 143, .3)
  .pc_stage_note
    display: inline-flex
    align-items: center
    gap: 5px
    padding: 4px 9px
    border: 1px solid #ffe6f0
    border-radius: 999px
    background: #fff7fa
    color: var(--pc-muted)
    font-size: 10px
    line-height: 1.4
    white-space: nowrap
    box-shadow: inset 0 1px 0 #ffffff
  .pc_stage_body
    flex: 1
    min-height: 0
    display: grid
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)
    gap: 14px
    padding: 4px 0 10px
  .pc_preview_tile
    min-width: 0
    min-height: 300px
    display: flex
    flex-direction: column
  .pc_preview_head
    height: 20px
    display: flex
    align-items: center
    gap: 7px
    padding: 0 2px
  .pc_dot
    width: 8px
    height: 8px
    border-radius: 3px
    flex: none
    &.input
      background: linear-gradient(145deg, #d8c8f5, #b39ddb)
      box-shadow: 0 0 0 3px rgba(179, 157, 219, .16)
    &.output
      background: linear-gradient(145deg, #ffb3cf, #f2588f)
      box-shadow: 0 0 0 3px rgba(242, 88, 143, .16)
      animation: pc_cute_pc_dot_pulse 2.6s ease-out infinite
  .pc_preview_label
    color: var(--pc-text-bright)
    font-size: 12.5px
    font-weight: 700
  .pc_dims
    margin-left: auto
    padding: 2px 8px
    border-radius: 999px
    background: #fff7fa
    border: 1px solid #ffe9f1
    color: var(--pc-faint)
    font-size: 10.5px
    white-space: nowrap
  .pc_well
    position: relative
    flex: 1
    min-height: 0
    margin-top: 8px
    padding: 16px
    border: 2px dashed #f4cddd
    border-radius: 20px
    background-color: var(--pc-field)
    background-image: radial-gradient(rgba(240, 112, 158, .1) 1.5px, transparent 1.5px)
    background-size: 17px 17px
    box-shadow: inset 0 3px 10px rgba(214, 146, 178, .07)
    overflow: hidden
    transition: border-color .35s ease, box-shadow .35s ease, background-color .35s ease
    &.has_image
      border-style: solid
      border-color: #ffffff
      box-shadow: inset 0 0 0 1px #fbeaf1, 0 6px 16px rgba(214, 146, 178, .1)
    &.clickable
      cursor: pointer
    &.clickable:hover
      border-color: #f5a9c8
      background-color: #ffffff
      box-shadow: 0 10px 24px rgba(240, 112, 158, .16), inset 0 0 0 1px #fff0f6
  .pc_empty
    position: absolute
    inset: 0
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    gap: 4px
    padding: 16px
    text-align: center
    pointer-events: none
    strong
      color: var(--pc-text-bright)
      font-family: "BAFJ_CU", "Microsoft YaHei UI", sans-serif
      font-size: 13px
      font-weight: 700
      letter-spacing: .3px
    > span:not(.pc_empty_icon)
      color: var(--pc-muted)
      font-size: 11.5px
    .pc_empty_icon
      width: 48px
      height: 48px
      margin-bottom: 6px
      border: 2px solid #ffffff
      border-radius: 17px
      background: linear-gradient(145deg, #fff3f8, #ffe6f1)
      display: inline-flex
      align-items: center
      justify-content: center
      box-shadow: 0 8px 18px rgba(240, 112, 158, .16), inset 0 1px 0 #ffffff
      animation: pc_cute_pc_busy_float 4.5s ease-in-out infinite
  .pc_empty_button
    pointer-events: auto
    height: 32px
    margin-top: 8px
    padding: 0 15px
    border: 2px solid #ffffff
    border-radius: 999px
    background: linear-gradient(135deg, #ffa6c6, #f0709e 60%, #e85b8f)
    color: #ffffff
    font-family: inherit
    font-size: 11.5px
    font-weight: 700
    display: inline-flex
    align-items: center
    gap: 6px
    cursor: pointer
    box-shadow: 0 6px 16px rgba(240, 112, 158, .3)
    transition: transform .28s cubic-bezier(.34, 1.56, .64, 1), box-shadow .28s ease, filter .28s ease
    &:hover:not(:disabled)
      transform: translateY(-2px)
      filter: brightness(1.03)
      box-shadow: 0 10px 22px rgba(240, 112, 158, .38)
    &:active:not(:disabled)
      transform: translateY(0) scale(.96)
    &:disabled
      cursor: not-allowed
      opacity: .5
    &:focus-visible
      outline: 3px solid rgba(239, 111, 159, .35)
      outline-offset: 2px
  .pc_busy
    position: absolute
    inset: 0
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    gap: 7px
    background: rgba(255, 250, 247, .88)
    backdrop-filter: blur(3px)
    strong
      color: var(--pc-text-bright)
      font-family: "BAFJ_CU", "Microsoft YaHei UI", sans-serif
      font-size: 13px
      font-weight: 700
  .pc_spinner
    width: 40px
    height: 40px
    border-radius: 50%
    border: 3px solid #ffe1ec
    border-top-color: var(--pc-rose)
    border-right-color: #ffb3d0
    box-shadow: 0 0 18px rgba(240, 112, 158, .22)
    animation: pc_cute_pc_spin .85s linear infinite
  .pc_busy_percent
    padding: 2px 9px
    border-radius: 999px
    background: #fff0f6
    border: 1px solid #ffe1ec
    color: var(--pc-ink-deep)
    font-size: 11px
    font-weight: 700
  .pc_stage_footer
    margin: 0 -14px
    padding: 0 16px
    min-height: 58px
    border-top: 1px dashed #f6e2ea
    background: linear-gradient(180deg, rgba(255, 250, 252, .9), rgba(255, 245, 249, .9))
    display: flex
    align-items: center
    justify-content: space-between
    gap: 12px
  .pc_status_group
    min-width: 0
    display: flex
    align-items: center
    gap: 8px
  .pc_status_dot
    width: 8px
    height: 8px
    border-radius: 50%
    background: var(--pc-faint)
    flex: none
    transition: background .3s ease
    &.tone-ok
      background: var(--pc-mint)
      animation: pc_cute_pc_dot_pulse 2.4s ease-out infinite
    &.tone-busy
      background: var(--pc-warn)
      animation: pc_cute_pc_dot_pulse 1.4s ease-out infinite
    &.tone-error
      background: var(--pc-red)
  .pc_status_text
    min-width: 0
    max-width: 320px
    color: var(--pc-muted)
    font-size: 11px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    &.error
      color: var(--pc-red)
  .pc_progress
    position: relative
    width: 76px
    height: 6px
    margin-left: 3px
    border-radius: 999px
    background: #ffeaf2
    overflow: hidden
    flex: none
    box-shadow: inset 0 1px 2px rgba(214, 146, 178, .15)
    i
      position: relative
      display: block
      height: 100%
      border-radius: inherit
      background: linear-gradient(90deg, #ffb3cf, #f0709e 55%, #8ec8f5)
      transition: width .25s ease
      &::after
        content: ""
        position: absolute
        inset: 0
        width: 45%
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, .8), rgba(255, 255, 255, 0))
        animation: pc_cute_pc_shimmer 2.2s ease-in-out infinite
  .pc_local
    padding: 2px 8px
    border-radius: 999px
    background: #eaf9f2
    border: 1px solid #c8efdf
    color: #43a982
    font-size: 10px
    font-weight: 700
    flex: none
  .pc_stage_actions
    display: flex
    align-items: center
    gap: 8px
    flex: none
  .pc_batch_hint
    color: var(--pc-faint)
    font-size: 10px
    white-space: nowrap
    flex: none
  .pc_small_button
    height: 32px
    padding: 0 14px
    border-radius: 999px
    border: 2px solid #ffffff
    font-family: inherit
    font-size: 11px
    font-weight: 700
    display: inline-flex
    align-items: center
    gap: 6px
    cursor: pointer
    transition: transform .28s cubic-bezier(.34, 1.56, .64, 1), box-shadow .28s ease, background .28s ease, opacity .28s ease
    &:disabled
      cursor: not-allowed
      background: #f8edf2
      border-color: #ffffff
      color: #cbb6c2
      box-shadow: none
    &:focus-visible
      outline: 3px solid rgba(239, 111, 159, .35)
      outline-offset: 2px
  .pc_small_secondary
    background: linear-gradient(145deg, #ffffff, #fff5fa)
    border-color: #ffe1ec
    color: var(--pc-text-bright)
    box-shadow: 0 4px 10px rgba(214, 146, 178, .12), inset 0 1px 0 #ffffff
    &:hover:not(:disabled)
      transform: translateY(-2px)
      background: #ffffff
      border-color: #ffb3d0
      box-shadow: 0 8px 18px rgba(240, 112, 158, .2)
  .pc_small_primary
    background: linear-gradient(135deg, #ffa6c6, #f0709e 60%, #e85b8f)
    color: #ffffff
    box-shadow: var(--pc-glow), inset 0 1px 0 rgba(255, 255, 255, .5)
    &:hover:not(:disabled)
      transform: translateY(-2px)
      filter: brightness(1.03)
      box-shadow: 0 10px 22px rgba(240, 112, 158, .38)
  @media (max-width: 1080px)
    .pc_stage_body
      grid-template-columns: minmax(0, 1fr)
    .pc_preview_tile
      min-height: 0
    .pc_well
      flex: none
      height: min(46vh, 420px)
  @media (max-width: 720px)
    .pc_stage_head
      flex-direction: column
      gap: 6px
    .pc_stage_note
      white-space: normal
      align-items: flex-start
    .pc_well
      padding: 12px
      height: min(42vh, 340px)
    .pc_preview_tile
      min-height: 0
    .pc_stage_footer
      flex-wrap: wrap
      padding-top: 8px
      padding-bottom: 8px
    .pc_status_text
      max-width: 180px
    .pc_batch_hint
      margin-left: auto
  @media (prefers-reduced-motion: reduce)
    .pc_dot, .pc_empty_icon, .pc_progress i::after, .pc_status_dot, .pc_spinner
      animation: none !important
</style>
