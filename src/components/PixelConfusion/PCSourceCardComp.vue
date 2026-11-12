<script setup lang="ts">
import { ref } from "vue";
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import PCImageCanvasComp from "@/components/PixelConfusion/PCImageCanvasComp.vue";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";
import { PC_FORMAT_LABEL } from "@/utils/PixelConfusion/image";

const store = usePCToolStore();
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
          <PCIconComp name="image" :size="15" color="#8b9098"/>
        </span>
        <span class="pc_drop_text">
          <strong>选择一张图片</strong>
          <small>{{ PC_FORMAT_LABEL }} · 也可拖拽到此处</small>
        </span>
      </div>
      <button
          type="button"
          class="pc_text_link"
          :disabled="store.busy"
          @click="store.useDemo"
      >
        <PCIconComp name="sparkles" :size="12"/>
        使用内置测试图
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
          <PCIconComp name="upload" :size="13" color="#d7dae0"/>
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
          <PCIconComp name="x" :size="14" color="#b8bec6"/>
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
</style>
