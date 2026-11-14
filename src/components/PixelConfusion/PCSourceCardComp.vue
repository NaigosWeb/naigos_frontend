<script setup lang="ts">
import { ref } from "vue";
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import PCImageCanvasComp from "@/components/PixelConfusion/PCImageCanvasComp.vue";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";
import { usePCTheme } from "@/composables/usePCTheme";
import { PC_FORMAT_LABEL } from "@/utils/PixelConfusion/image";

const store = usePCToolStore();
const { isCute } = usePCTheme();
const dragging = ref(false);

const onDragOver = () => {
    if (store.busy) return;
    dragging.value = true;
};

const onDragLeave = () => {
    dragging.value = false;
};

const onDrop = (event: DragEvent) => {
    dragging.value = false;
    if (store.busy) return;
    const file = event.dataTransfer?.files?.[0];
    if (file) void store.loadFile(file);
};
</script>

<template>
  <section
      class="pc_card pc_source_card"
      :class="{ is_dragging: dragging, is_empty: !store.source }"
      @dragenter.prevent="onDragOver"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
  >
    <div v-if="!store.source" class="pc_source_row">
      <div
          class="pc_dropzone"
          role="button"
          tabindex="0"
          :aria-disabled="store.busy"
          @click="store.openImagePicker"
          @keydown.enter.prevent="store.openImagePicker"
          @keydown.space.prevent="store.openImagePicker"
      >
        <span class="pc_drop_icon">
          <PCIconComp name="image" :size="isCute ? 17 : 15" :color="isCute ? 'var(--pc-ink)' : '#8b9098'"/>
        </span>
        <span class="pc_drop_text">
          <strong>{{ isCute ? "把图片放进来吧～" : "选择一张图片" }}</strong>
          <small>{{ PC_FORMAT_LABEL }} · {{ isCute ? "也可以直接拖拽到这里" : "也可拖拽到此处" }}</small>
        </span>
      </div>
      <button
          type="button"
          class="pc_text_link"
          :disabled="store.busy"
          @click="store.useDemo"
      >
        <PCIconComp name="sparkles" :size="12"/>
        {{ isCute ? "试试内置测试图" : "使用内置测试图" }}
      </button>
    </div>

    <div v-else class="pc_source_row">
      <button
          type="button"
          class="pc_thumb"
          title="更换图片"
          aria-label="更换图片"
          :disabled="store.busy"
          @click="store.openImagePicker"
      >
        <PCImageCanvasComp :image="store.source.canvas" fit="contain"/>
      </button>
      <div class="pc_source_info">
        <div class="pc_source_head">
          <span class="pc_source_label">来源图片</span>
          <span class="pc_pill" :class="`tone-${store.sourcePill.tone}`">
            <i class="pc_pill_dot"/>
            {{ store.sourcePill.text }}
          </span>
        </div>
        <div class="pc_source_name" :title="store.source.name">{{ store.source.name }}</div>
        <div class="pc_source_meta" :title="store.source.meta">{{ store.source.meta }}</div>
      </div>
      <div class="pc_source_actions">
        <button
            type="button"
            class="pc_replace_button"
            :disabled="store.busy"
            @click="store.openImagePicker"
        >
          <PCIconComp name="upload" :size="13" :color="isCute ? 'var(--pc-ink-deep)' : 'var(--pc-text)'"/>
          更换图片
        </button>
        <button
            type="button"
            class="pc_icon_button"
            title="清空图片"
            aria-label="清空图片"
            :disabled="store.busy"
            @click="store.clearSource"
        >
          <PCIconComp name="x" :size="14" :color="isCute ? 'var(--pc-muted)' : '#b8bec6'"/>
        </button>
        <span class="pc_divider"/>
        <button
            type="button"
            class="pc_text_link"
            :disabled="store.busy"
            @click="store.useDemo"
        >
          <PCIconComp name="sparkles" :size="12"/>
          换成内置测试图
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="sass">
// 深色商务主题（默认）：7570a23 原版样式

html[data-pc-theme="dark"]
  .pc_source_card
    min-height: 92px
    padding: 10px 12px
    display: flex
    align-items: center
    transition: border-color .2s ease, box-shadow .2s ease
    &.is_dragging
      border-color: var(--pc-ink)
      box-shadow: 0 0 0 2px rgba(47, 107, 255, .18)
  .pc_source_row
    width: 100%
    min-width: 0
    display: flex
    align-items: center
    gap: 12px
  .pc_dropzone
    flex: 1
    min-width: 0
    height: 68px
    padding: 0 16px
    border: 1px dashed var(--pc-line-strong)
    border-radius: 6px
    background: var(--pc-field)
    display: flex
    align-items: center
    gap: 12px
    cursor: pointer
    transition: background .2s ease, border-color .2s ease
    &:hover
      background: var(--pc-surface-alt)
      border-color: #5c6066
    &:focus-visible
      outline: 2px solid var(--pc-ink)
      outline-offset: 2px
  .pc_drop_icon
    width: 32px
    height: 30px
    border-radius: 7px
    background: var(--pc-surface-alt)
    border: 1px solid var(--pc-line)
    display: inline-flex
    align-items: center
    justify-content: center
    flex: none
  .pc_drop_text
    min-width: 0
    display: flex
    flex-direction: column
    gap: 3px
    text-align: left
    strong
      color: var(--pc-text)
      font-size: 13px
      font-weight: 700
    small
      color: var(--pc-faint)
      font-size: 10px
  .pc_thumb
    width: 56px
    height: 56px
    flex: none
    padding: 4px
    margin-left: 2px
    border-radius: 8px
    overflow: hidden
    background: var(--pc-field)
    border: 1px solid var(--pc-line-strong)
    cursor: pointer
    transition: border-color .2s ease
    &:hover:not(:disabled)
      border-color: #5c6066
    &:disabled
      cursor: not-allowed
      opacity: .6
    &:focus-visible
      outline: 2px solid var(--pc-ink)
      outline-offset: 2px
  .pc_source_info
    flex: 1
    min-width: 0
  .pc_source_head
    display: flex
    align-items: center
    gap: 9px
    min-width: 0
  .pc_source_label
    color: var(--pc-faint)
    font-size: 10px
    line-height: 1.3
  .pc_source_name
    margin-top: 3px
    color: var(--pc-text-bright)
    font-size: 13px
    font-weight: 700
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
  .pc_source_meta
    margin-top: 4px
    color: var(--pc-faint)
    font-size: 11px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
  .pc_pill
    display: inline-flex
    align-items: center
    gap: 5px
    height: 18px
    padding: 0 7px
    border-radius: 4px
    border: 1px solid var(--pc-line-strong)
    background: #35373b
    color: var(--pc-muted)
    font-size: 10px
    line-height: 1
    white-space: nowrap
    flex: none
    .pc_pill_dot
      width: 5px
      height: 5px
      border-radius: 50%
      background: var(--pc-faint)
    &.tone-loaded
      background: #2f405c
      border-color: #47709f
      color: #cfe0ff
      .pc_pill_dot
        background: #4d8df7
    &.tone-busy
      background: #3a3322
      border-color: #5c4a22
      color: var(--pc-pink)
      .pc_pill_dot
        background: var(--pc-pink)
  .pc_source_actions
    display: flex
    align-items: center
    gap: 6px
    flex: none
  .pc_replace_button
    height: 30px
    padding: 0 11px
    border-radius: 5px
    border: 1px solid #4a4d52
    background: #35373b
    color: var(--pc-text)
    font-family: inherit
    font-size: 11px
    font-weight: 700
    display: inline-flex
    align-items: center
    gap: 6px
    cursor: pointer
    transition: background .2s ease, border-color .2s ease, opacity .2s ease
    &:hover:not(:disabled)
      background: #414449
      border-color: #5c6066
    &:disabled
      cursor: not-allowed
      opacity: .45
    &:focus-visible
      outline: 2px solid var(--pc-ink)
      outline-offset: 2px
  .pc_icon_button
    width: 30px
    height: 30px
    padding: 0
    border: 1px solid transparent
    border-radius: 5px
    background: transparent
    display: inline-flex
    align-items: center
    justify-content: center
    cursor: pointer
    transition: background .2s ease, border-color .2s ease, opacity .2s ease
    &:hover:not(:disabled)
      background: #35373b
      border-color: var(--pc-line-strong)
    &:disabled
      cursor: not-allowed
      opacity: .45
    &:focus-visible
      outline: 2px solid var(--pc-ink)
      outline-offset: 2px
  .pc_divider
    width: 1px
    height: 20px
    margin: 0 6px
    background: var(--pc-line-strong)
    flex: none
  .pc_text_link
    padding: 4px 2px
    border: 0
    background: transparent
    color: var(--pc-muted)
    font-family: inherit
    font-size: 11px
    display: inline-flex
    align-items: center
    gap: 6px
    cursor: pointer
    white-space: nowrap
    border-radius: 4px
    transition: color .2s ease
    &:hover:not(:disabled)
      color: var(--pc-text)
    &:disabled
      cursor: not-allowed
      opacity: .45
    &:focus-visible
      outline: 2px solid var(--pc-ink)
      outline-offset: 2px
  @media (max-width: 900px)
    .pc_source_row
      flex-wrap: wrap
    .pc_source_actions
      width: 100%
      justify-content: flex-end
      padding-top: 2px
  @media (max-width: 720px)
    .pc_source_card
      padding: 10px
    .pc_source_row
      gap: 10px

// 二次元主题：仅 html[data-pc-theme="cute"] 下生效

@keyframes pc_cute_pc_drop_bob
  0%, 100%
    transform: translateY(0) rotate(0deg)
  50%
    transform: translateY(-3px) rotate(-4deg)

@keyframes pc_cute_pc_pill_pulse
  0%, 100%
    box-shadow: 0 0 0 0 rgba(89, 197, 154, .35)
  60%
    box-shadow: 0 0 0 4px rgba(89, 197, 154, 0)

@keyframes pc_cute_pc_pixels_dance
  0%, 100%
    transform: translateY(-50%) rotate(6deg) scale(1)
  50%
    transform: translateY(calc(-50% - 3px)) rotate(-8deg) scale(1.06)

html[data-pc-theme="cute"]
  .pc_source_card
    min-height: 98px
    padding: 12px 14px
    display: flex
    align-items: center
    transition: border-color .3s ease, box-shadow .3s ease, background .3s ease
    &.is_dragging
      border-color: #ffb3d0
      background: linear-gradient(150deg, #fffafc, #fff0f7)
      box-shadow: 0 0 0 5px rgba(240, 112, 158, .14), var(--pc-shadow-lift)
  .pc_source_row
    width: 100%
    min-width: 0
    display: flex
    align-items: center
    gap: 14px
  .pc_dropzone
    position: relative
    flex: 1
    min-width: 0
    height: 72px
    padding: 0 16px
    border: 2px dashed #f4cddd
    border-radius: 19px
    background: rgba(255, 252, 253, .62)
    display: flex
    align-items: center
    gap: 13px
    cursor: pointer
    transition: background .3s ease, border-color .3s ease, box-shadow .3s ease, transform .3s ease
    &::after
      content: ""
      position: absolute
      right: 24px
      top: 50%
      width: 10px
      height: 10px
      border-radius: 3px
      background: #ffd6e6
      box-shadow: -15px -9px 0 0 #d8ecff, 13px 9px 0 0 #fff0c9, -5px 13px 0 0 #ddf6ec, 18px -13px 0 0 #efe4ff
      opacity: .85
      pointer-events: none
      transform: translateY(-50%) rotate(6deg)
      animation: pc_cute_pc_pixels_dance 5s ease-in-out infinite
    &:hover
      background: #ffffff
      border-color: #f5a9c8
      box-shadow: 0 10px 22px rgba(240, 112, 158, .14)
      transform: translateY(-1px)
      .pc_drop_icon
        animation: pc_cute_pc_drop_bob 1.6s ease-in-out infinite
        background: linear-gradient(145deg, #ffe4ef, #ffd6e6)
    &:focus-visible
      outline: 3px solid rgba(239, 111, 159, .3)
      outline-offset: 3px
  .pc_drop_icon
    width: 40px
    height: 40px
    border-radius: 14px
    background: linear-gradient(145deg, #fff2f8, #ffe8f2)
    border: 2px solid #ffffff
    display: inline-flex
    align-items: center
    justify-content: center
    flex: none
    box-shadow: 0 4px 10px rgba(240, 112, 158, .16), inset 0 1px 0 #ffffff
    transition: transform .3s ease, background .3s ease
  .pc_drop_text
    min-width: 0
    display: flex
    flex-direction: column
    gap: 4px
    text-align: left
    strong
      color: var(--pc-text-bright)
      font-family: var(--pc-font-round)
      font-size: 14px
      font-weight: 700
      letter-spacing: .3px
    small
      color: var(--pc-faint)
      font-size: 10.5px
  .pc_thumb
    width: 62px
    height: 62px
    flex: none
    padding: 3px
    margin-left: 2px
    border-radius: 19px
    overflow: hidden
    background: #ffffff
    border: 2px solid #ffffff
    box-shadow: 0 6px 16px rgba(214, 146, 178, .22)
    cursor: pointer
    transform: rotate(-2deg)
    transition: transform .35s cubic-bezier(.34, 1.56, .64, 1), box-shadow .3s ease
    &:hover:not(:disabled)
      transform: rotate(0deg) scale(1.05)
      box-shadow: 0 10px 22px rgba(240, 112, 158, .26)
    &:disabled
      cursor: not-allowed
      opacity: .6
    &:focus-visible
      outline: 3px solid rgba(239, 111, 159, .3)
      outline-offset: 2px
  .pc_source_info
    flex: 1
    min-width: 0
  .pc_source_head
    display: flex
    align-items: center
    gap: 9px
    min-width: 0
  .pc_source_label
    color: var(--pc-faint)
    font-size: 10.5px
    letter-spacing: .4px
    line-height: 1.3
  .pc_source_name
    margin-top: 4px
    color: var(--pc-text-bright)
    font-size: 13.5px
    font-weight: 700
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
  .pc_source_meta
    margin-top: 4px
    color: var(--pc-faint)
    font-size: 11px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
  .pc_pill
    display: inline-flex
    align-items: center
    gap: 5px
    height: 20px
    padding: 0 9px
    border-radius: 999px
    border: 1px solid #ffe0ec
    background: #fff4f8
    color: var(--pc-muted)
    font-size: 10px
    font-weight: 700
    line-height: 1
    white-space: nowrap
    flex: none
    .pc_pill_dot
      width: 6px
      height: 6px
      border-radius: 50%
      background: var(--pc-faint)
    &.tone-loaded
      background: linear-gradient(135deg, #ecfbf5, #ddf6ec)
      border-color: #bdeedb
      color: #43a982
      .pc_pill_dot
        background: var(--pc-mint)
        animation: pc_cute_pc_pill_pulse 2.2s ease-out infinite
    &.tone-busy
      background: linear-gradient(135deg, #fff8e7, #fff0d4)
      border-color: #ffe0ad
      color: #d08e28
      .pc_pill_dot
        background: var(--pc-warn)
        animation: pc_cute_pc_pill_pulse 1.4s ease-out infinite
  .pc_source_actions
    display: flex
    align-items: center
    gap: 8px
    flex: none
  .pc_replace_button
    height: 34px
    padding: 0 13px
    border-radius: 999px
    border: 2px solid #ffe1ec
    background: linear-gradient(145deg, #ffffff, #fff6fa)
    color: var(--pc-text-bright)
    font-family: inherit
    font-size: 11.5px
    font-weight: 700
    display: inline-flex
    align-items: center
    gap: 6px
    cursor: pointer
    box-shadow: 0 4px 10px rgba(214, 146, 178, .14), inset 0 1px 0 #ffffff
    transition: transform .25s ease, background .25s ease, border-color .25s ease, box-shadow .25s ease, opacity .25s ease
    &:hover:not(:disabled)
      transform: translateY(-2px)
      background: #ffffff
      border-color: #ffb3d0
      box-shadow: 0 8px 18px rgba(240, 112, 158, .22)
    &:active:not(:disabled)
      transform: translateY(0) scale(.97)
    &:disabled
      cursor: not-allowed
      opacity: .45
    &:focus-visible
      outline: 3px solid rgba(239, 111, 159, .3)
      outline-offset: 2px
  .pc_icon_button
    width: 34px
    height: 34px
    padding: 0
    border: 2px solid transparent
    border-radius: 50%
    background: transparent
    display: inline-flex
    align-items: center
    justify-content: center
    cursor: pointer
    transition: background .25s ease, border-color .25s ease, transform .25s ease, opacity .25s ease
    &:hover:not(:disabled)
      background: #fff0f6
      border-color: #ffe1ec
      transform: rotate(90deg)
    &:disabled
      cursor: not-allowed
      opacity: .45
    &:focus-visible
      outline: 3px solid rgba(239, 111, 159, .3)
      outline-offset: 2px
  .pc_divider
    width: 2px
    height: 22px
    margin: 0 6px
    border-radius: 2px
    background: linear-gradient(180deg, rgba(255, 214, 230, 0), #ffd6e6, rgba(255, 214, 230, 0))
    flex: none
  .pc_text_link
    padding: 6px 8px
    border: 0
    background: transparent
    color: #c98aa8
    font-family: inherit
    font-size: 11px
    font-weight: 700
    display: inline-flex
    align-items: center
    gap: 6px
    cursor: pointer
    white-space: nowrap
    border-radius: 999px
    transition: color .25s ease, background .25s ease
    :deep(.pc_icon)
      transition: transform .35s cubic-bezier(.34, 1.56, .64, 1)
    &:hover:not(:disabled)
      color: var(--pc-ink-deep)
      background: #fff0f6
      :deep(.pc_icon)
        transform: rotate(18deg) scale(1.12)
    &:disabled
      cursor: not-allowed
      opacity: .45
    &:focus-visible
      outline: 3px solid rgba(239, 111, 159, .3)
      outline-offset: 2px
  @media (max-width: 900px)
    .pc_source_row
      flex-wrap: wrap
    .pc_source_actions
      width: 100%
      justify-content: flex-end
      padding-top: 2px
  @media (max-width: 720px)
    .pc_source_card
      min-height: 0
      padding: 12px
    .pc_source_row
      gap: 10px
    .pc_dropzone
      height: 66px
      padding: 0 12px
      padding-right: 48px
      &::after
        right: 16px
        opacity: .7
    .pc_drop_text small
      font-size: 10px
  @media (max-width: 560px)
    .pc_source_card.is_empty .pc_source_row
      flex-direction: column
      align-items: stretch
      gap: 4px
    .pc_source_card.is_empty .pc_dropzone
      width: 100%
      flex: none
    .pc_source_card.is_empty .pc_text_link
      align-self: flex-end
  @media (max-width: 480px)
    .pc_dropzone::after
      display: none
  @media (prefers-reduced-motion: reduce)
    .pc_dropzone:hover .pc_drop_icon,
    .pc_dropzone::after,
    .pc_pill .pc_pill_dot
      animation: none
</style>
