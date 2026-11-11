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

const props = withDefaults(defineProps<{
    name: string;
    size?: number;
    color?: string;
}>(), {
    size: 16,
    color: "currentColor"
});

const iconUrl = computed(() => iconMap[props.name] || iconMap.info);
const iconStyle = computed(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    backgroundColor: props.color,
    maskImage: `url("${iconUrl.value}")`,
    WebkitMaskImage: `url("${iconUrl.value}")`
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
