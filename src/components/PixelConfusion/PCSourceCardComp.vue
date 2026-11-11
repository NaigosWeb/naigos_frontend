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
      :class="{ is_dragging: dragging }"
      @dragenter.prevent="onDragOver"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
  >
    <div class="pc_card_head">
      <h2>来源图片</h2>
      <span class="pc_pill" :class="`tone-${store.sourcePill.tone}`">
        <i class="pc_pill_dot"/>
        {{ store.sourcePill.text }}
      </span>
    </div>

    <div class="pc_source_body">
      <div
          v-if="!store.source"
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
        <strong>选择一张图片</strong>
        <small>{{ PC_FORMAT_LABEL }}</small>
      </div>

      <div v-else class="pc_loaded_row">
        <div class="pc_thumb">
          <PCImageCanvasComp :image="store.source.canvas" fit="contain"/>
        </div>
        <div class="pc_source_info">
          <div class="pc_source_name" :title="store.source.name">{{ store.source.name }}</div>
          <div class="pc_source_meta" :title="store.source.meta">{{ store.source.meta }}</div>
        </div>
        <div class="pc_source_actions">
          <button
              type="button"
              class="pc_icon_button"
              title="更换图片"
              aria-label="更换图片"
              :disabled="store.busy"
              @click="store.openImagePicker"
          >
            <PCIconComp name="upload" :size="14" color="#b8bec6"/>
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
        </div>
      </div>
    </div>

    <button
        type="button"
        class="pc_text_link"
        :disabled="store.busy"
        @click="store.useDemo"
    >
      <PCIconComp name="sparkles" :size="12"/>
      {{ store.source ? "换成内置测试图" : "使用内置测试图" }}
    </button>
  </section>
</template>

<style scoped lang="sass">
.pc_source_card
  min-height: 206px
  display: flex
  flex-direction: column
  transition: border-color .2s ease, box-shadow .2s ease
  &.is_dragging
    border-color: var(--pc-ink)
    box-shadow: 0 0 0 2px rgba(47, 107, 255, .18)
.pc_card_head
  display: flex
  align-items: center
  justify-content: space-between
  gap: 10px
  min-height: 22px
  h2
    margin: 0
    color: var(--pc-text)
    font-size: 13px
    font-weight: 700
.pc_pill
  display: inline-flex
  align-items: center
  gap: 5px
  height: 20px
  padding: 0 8px
  border-radius: 5px
  border: 1px solid var(--pc-line-strong)
  background: #35373b
  color: var(--pc-muted)
  font-size: 11px
  line-height: 1
  white-space: nowrap
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
.pc_source_body
  flex: 1
  margin-top: 8px
.pc_dropzone
  height: 108px
  border: 1px dashed var(--pc-line-strong)
  border-radius: 6px
  background: var(--pc-field)
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 3px
  cursor: pointer
  transition: background .2s ease, border-color .2s ease
  &:hover
    background: var(--pc-surface-alt)
    border-color: #5c6066
  &:focus-visible
    outline: 2px solid var(--pc-ink)
    outline-offset: 2px
  .pc_drop_icon
    width: 30px
    height: 28px
    border-radius: 7px
    background: var(--pc-surface-alt)
    border: 1px solid var(--pc-line)
    display: inline-flex
    align-items: center
    justify-content: center
    margin-bottom: 3px
  strong
    color: var(--pc-text)
    font-size: 13px
    font-weight: 700
  small
    color: var(--pc-faint)
    font-size: 10px
.pc_loaded_row
  height: 108px
  display: flex
  align-items: center
  gap: 12px
  min-width: 0
.pc_thumb
  width: 58px
  height: 58px
  flex: none
  padding: 4px
  border-radius: 8px
  overflow: hidden
  background: var(--pc-field)
  border: 1px solid var(--pc-line-strong)
.pc_source_info
  flex: 1
  min-width: 0
.pc_source_name
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
.pc_source_actions
  display: flex
  align-items: center
  gap: 3px
  flex: none
.pc_icon_button
  width: 26px
  height: 26px
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
.pc_text_link
  margin-top: 8px
  padding: 3px 0
  border: 0
  background: transparent
  color: var(--pc-muted)
  font-size: 11px
  display: inline-flex
  align-items: center
  gap: 7px
  cursor: pointer
  align-self: flex-start
  transition: color .2s ease
  &:hover:not(:disabled)
    color: var(--pc-text)
  &:disabled
    cursor: not-allowed
    opacity: .45
  &:focus-visible
    outline: 2px solid var(--pc-ink)
    outline-offset: 2px
    border-radius: 4px
</style>
