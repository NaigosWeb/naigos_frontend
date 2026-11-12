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
@keyframes pc_tile_in
  0%
    opacity: 0
    transform: translateY(10px) scale(.92)
  100%
    opacity: 1
    transform: translateY(0) scale(1)
.pc_result_tile
  position: relative
  width: 100%
  height: 148px
  padding: 6px 6px 0
  border: 2px solid #ffffff
  border-radius: 17px
  background: #ffffff
  display: flex
  flex-direction: column
  align-items: stretch
  cursor: pointer
  font-family: inherit
  box-shadow: 0 6px 14px rgba(214, 146, 178, .14), inset 0 1px 0 #ffffff
  animation: pc_tile_in .38s cubic-bezier(.34, 1.56, .64, 1) backwards
  transition: transform .3s cubic-bezier(.34, 1.56, .64, 1), box-shadow .3s ease, border-color .3s ease, opacity .3s ease
  &:nth-child(1)
    animation-delay: .01s
  &:nth-child(2)
    animation-delay: .04s
  &:nth-child(3)
    animation-delay: .07s
  &:nth-child(4)
    animation-delay: .1s
  &:nth-child(5)
    animation-delay: .13s
  &:nth-child(6)
    animation-delay: .16s
  &:nth-child(7)
    animation-delay: .19s
  &:nth-child(8)
    animation-delay: .22s
  &:nth-child(n+9)
    animation-delay: .25s
  &:hover:not(.is_disabled)
    transform: translateY(-4px) rotate(-.8deg)
    box-shadow: 0 16px 28px rgba(214, 146, 178, .24), inset 0 1px 0 #ffffff
    &.accent-reverse
      border-color: #b9dcf7
      box-shadow: 0 16px 28px rgba(106, 174, 232, .24), inset 0 1px 0 #ffffff
    &.accent-forward
      border-color: #ffc2d8
      box-shadow: 0 16px 28px rgba(242, 88, 143, .24), inset 0 1px 0 #ffffff
  &:active:not(.is_disabled)
    transform: translateY(-1px) scale(.98)
  &:focus-visible
    outline: 3px solid rgba(239, 111, 159, .35)
    outline-offset: 2px
  &.is_disabled
    cursor: not-allowed
    opacity: .55
.pc_tile_image
  flex: 1
  min-height: 0
  padding: 3px
  border-radius: 12px
  background: #fffaf5
  display: flex
  align-items: center
  justify-content: center
  overflow: hidden
  canvas
    display: block
    max-width: 100%
    max-height: 100%
    border-radius: 8px
.pc_tile_label
  flex: none
  height: 26px
  margin: 4px 2px 0
  border-radius: 999px
  border: 1px solid #ffeaf2
  background: #fff5fa
  display: flex
  align-items: center
  justify-content: center
  color: var(--pc-text-bright)
  font-size: 11px
  font-weight: 700
  line-height: 1
  transition: background .25s ease, border-color .25s ease, color .25s ease
.accent-reverse .pc_tile_label
  background: #f1f8ff
  border-color: #d8ecff
  color: #4f86b8
.accent-forward .pc_tile_label
  background: #fff0f6
  border-color: #ffd6e5
  color: #d95388
.pc_result_tile.is_disabled .pc_tile_label
  color: var(--pc-muted)
  background: #faf3f6
  border-color: #f6e6ed
@media (prefers-reduced-motion: reduce)
  .pc_result_tile
    animation: none
</style>
