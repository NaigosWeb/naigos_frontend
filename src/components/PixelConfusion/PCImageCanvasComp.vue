<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

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
    context.fillStyle = "#1e1f22";
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
</script>

<template>
  <canvas ref="canvasRef" class="pc_image_canvas" aria-hidden="true"/>
</template>

<style scoped lang="sass">
.pc_image_canvas
  display: block
  width: 100%
  height: 100%
</style>
