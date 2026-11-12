<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { PCBatchItemImpl } from "@/interfaces/PixelConfusionImpl";

const props = withDefaults(defineProps<{
    item: PCBatchItemImpl;
    accent: "reverse" | "forward";
    disabled?: boolean;
}>(), {
    disabled: false
});

const emit = defineEmits<{
    open: [];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

function paint() {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const data = props.item.thumbnail;
    if (canvas.width !== data.width) canvas.width = data.width;
    if (canvas.height !== data.height) canvas.height = data.height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.putImageData(data, 0, 0);
}

onMounted(paint);
watch(() => props.item, paint, { flush: "post" });
</script>

<template>
  <button
      type="button"
      class="pc_result_tile"
      :class="[`accent-${accent}`, { is_disabled: disabled }]"
      :disabled="disabled"
      :title="`第 ${item.iteration} 次 · 点击预览`"
      @click="emit('open')"
  >
    <span class="pc_tile_image">
      <canvas ref="canvasRef"/>
    </span>
    <span class="pc_tile_label">第 {{ item.iteration }} 次</span>
  </button>
</template>

<style scoped lang="sass">
.pc_result_tile
  width: 100%
  height: 146px
  padding: 6px 6px 0
  border: 1px solid var(--pc-line)
  border-radius: 6px
  background: var(--pc-field)
  display: flex
  flex-direction: column
  align-items: stretch
  cursor: pointer
  font-family: inherit
  transition: background .2s ease, border-color .2s ease, opacity .2s ease
  &:hover:not(.is_disabled)
    background: var(--pc-surface-alt)
    &.accent-reverse
      border-color: var(--pc-ink)
    &.accent-forward
      border-color: var(--pc-rose)
  &:focus-visible
    outline: 2px solid var(--pc-ink)
    outline-offset: 1px
  &.is_disabled
    cursor: not-allowed
    opacity: .55
.pc_tile_image
  flex: 1
  min-height: 0
  display: flex
  align-items: center
  justify-content: center
  overflow: hidden
  canvas
    display: block
    max-width: 100%
    max-height: 100%
.pc_tile_label
  flex: none
  height: 24px
  display: flex
  align-items: center
  justify-content: center
  color: var(--pc-text-bright)
  font-size: 11px
  font-weight: 700
  line-height: 1
.pc_result_tile.is_disabled .pc_tile_label
  color: var(--pc-muted)
</style>
