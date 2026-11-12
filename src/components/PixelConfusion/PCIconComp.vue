<script setup lang="ts">
import { computed } from "vue";
import arrowDown from "@/assets/PixelConfusion/icons/arrow-down.png";
import check from "@/assets/PixelConfusion/icons/check.png";
import corner from "@/assets/PixelConfusion/icons/corner.png";
import download from "@/assets/PixelConfusion/icons/download.png";
import grid from "@/assets/PixelConfusion/icons/grid.png";
import help from "@/assets/PixelConfusion/icons/help.png";
import image from "@/assets/PixelConfusion/icons/image.png";
import info from "@/assets/PixelConfusion/icons/info.png";
import lock from "@/assets/PixelConfusion/icons/lock.png";
import minus from "@/assets/PixelConfusion/icons/minus.png";
import pixelconfusion from "@/assets/PixelConfusion/icons/pixelconfusion.png";
import plus from "@/assets/PixelConfusion/icons/plus.png";
import rotate from "@/assets/PixelConfusion/icons/rotate.png";
import route from "@/assets/PixelConfusion/icons/route.png";
import shuffle from "@/assets/PixelConfusion/icons/shuffle.png";
import sparkles from "@/assets/PixelConfusion/icons/sparkles.png";
import upload from "@/assets/PixelConfusion/icons/upload.png";
import x from "@/assets/PixelConfusion/icons/x.png";

const iconMap: Record<string, string> = {
    "arrow-down": arrowDown,
    check,
    corner,
    download,
    grid,
    help,
    image,
    info,
    lock,
    minus,
    pixelconfusion,
    plus,
    rotate,
    route,
    shuffle,
    sparkles,
    upload,
    x
};

/** Directional arrows reuse the arrow glyph, matching the desktop icons. */
const rotatedIcons: Record<string, { base: string; rotation: number }> = {
    "arrow-left": { base: "arrow-down", rotation: 90 },
    "arrow-right": { base: "arrow-down", rotation: -90 }
};

const props = withDefaults(defineProps<{
    name: string;
    size?: number;
    color?: string;
}>(), {
    size: 16,
    color: "currentColor"
});

const resolved = computed(() => {
    const rotated = rotatedIcons[props.name];
    if (rotated) {
        return {
            url: iconMap[rotated.base] || iconMap.info,
            rotation: rotated.rotation
        };
    }
    return {
        url: iconMap[props.name] || iconMap.info,
        rotation: 0
    };
});

const iconStyle = computed(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    backgroundColor: props.color,
    maskImage: `url("${resolved.value.url}")`,
    WebkitMaskImage: `url("${resolved.value.url}")`,
    transform: resolved.value.rotation
        ? `rotate(${resolved.value.rotation}deg)`
        : undefined
}));
</script>

<template>
  <span class="pc_icon" :style="iconStyle" aria-hidden="true"/>
</template>

<style scoped lang="sass">
.pc_icon
  display: inline-block
  flex: none
  mask-repeat: no-repeat
  mask-position: center
  mask-size: contain
  -webkit-mask-repeat: no-repeat
  -webkit-mask-position: center
  -webkit-mask-size: contain
</style>
