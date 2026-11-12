<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { usePCTheme } from "@/composables/usePCTheme";

const { isCute } = usePCTheme();

const props = withDefaults(defineProps<{
    image: HTMLCanvasElement | null;
    fit?: "contain" | "cover";
}>(), {
    fit: "contain"
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
let observer: ResizeObserver | null = null;
let frame = 0;

function draw() {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, width, height);
    // 深色主题使用暗色底，二次元主题使用奶油底
    context.fillStyle = isCute.value ? "#fffaf5" : "#1e1f22";
    context.fillRect(0, 0, width, height);

    const image = props.image;
    if (!image || !image.width || !image.height) return;

    const scale = props.fit === "cover"
        ? Math.max(width / image.width, height / image.height)
        : Math.min(width / image.width, height / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, x, y, drawWidth, drawHeight);
}

function scheduleDraw() {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
        frame = 0;
        draw();
    });
}

onMounted(() => {
    draw();
    if (typeof ResizeObserver !== "undefined" && canvasRef.value) {
        observer = new ResizeObserver(scheduleDraw);
        observer.observe(canvasRef.value);
    }
});

onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
    if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
    }
});

watch(() => props.image, scheduleDraw, { flush: "post" });
watch(() => props.fit, scheduleDraw);
watch(isCute, scheduleDraw);
</script>

<template>
  <canvas ref="canvasRef" class="pc_image_canvas" aria-hidden="true"/>
</template>

<style scoped lang="sass">
@keyframes pc_canvas_in
  0%
    opacity: 0
    transform: scale(.985)
  100%
    opacity: 1
    transform: scale(1)
.pc_image_canvas
  display: block
  width: 100%
  height: 100%
  animation: pc_canvas_in .32s ease both
@media (prefers-reduced-motion: reduce)
  .pc_image_canvas
    animation: none
// =====================================================================
// 深色商务主题（默认）：html[data-pc-theme="dark"] 下恢复原版暗色样式
// =====================================================================
html[data-pc-theme="dark"]

    .pc_image_canvas
      display: block
      width: 100%
      height: 100%
</style>
