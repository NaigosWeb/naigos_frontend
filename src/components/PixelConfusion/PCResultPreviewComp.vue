<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import PCImageCanvasComp from "@/components/PixelConfusion/PCImageCanvasComp.vue";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";

const store = usePCToolStore();
const thumbRef = ref<HTMLCanvasElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);

const preview = computed(() => store.preview);

const directionLabel = computed(() => (
    preview.value?.direction === "reverse" ? "反向结果" : "正向结果"
));

const toneColor = computed(() => {
    switch (preview.value?.tone) {
        case "ok":
            return "#6ea4ff";
        case "busy":
            return "var(--pc-pink)";
        case "error":
            return "var(--pc-red)";
        default:
            return "var(--pc-muted)";
    }
});

const actionsEnabled = computed(() => {
    const current = preview.value;
    return !!current?.image && !store.busy;
});

function paintThumbnail() {
    const canvas = thumbRef.value;
    const current = preview.value;
    if (!canvas || !current) return;
    const data = current.thumbnail;
    if (canvas.width !== data.width) canvas.width = data.width;
    if (canvas.height !== data.height) canvas.height = data.height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.putImageData(data, 0, 0);
}

let previousOverflow = "";
let scrollLocked = false;
let lastFocused: HTMLElement | null = null;

const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
        event.stopPropagation();
        store.closePreview();
    }
};

function lockScroll() {
    if (scrollLocked) return;
    previousOverflow = document.body.style.overflow;
    lastFocused = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeydown);
    scrollLocked = true;
    requestAnimationFrame(() => dialogRef.value?.focus());
}

function unlockScroll() {
    if (!scrollLocked) return;
    document.body.style.overflow = previousOverflow;
    window.removeEventListener("keydown", onKeydown);
    scrollLocked = false;
    if (lastFocused?.isConnected) lastFocused.focus();
    lastFocused = null;
}

onMounted(() => {
    if (store.preview) {
        paintThumbnail();
        lockScroll();
    }
});

onBeforeUnmount(() => {
    unlockScroll();
});

watch(() => store.preview, value => {
    if (value) {
        paintThumbnail();
        lockScroll();
    } else {
        unlockScroll();
    }
}, { flush: "post" });

watch(() => store.preview?.thumbnail, () => {
    paintThumbnail();
}, { flush: "post" });

watch(() => store.preview?.status, () => {
    paintThumbnail();
}, { flush: "post" });
</script>

<template>
  <Teleport to="body">
    <div
        v-if="preview"
        class="pc_preview_mask"
        @click.self="store.closePreview"
    >
      <section
          ref="dialogRef"
          class="pc_preview_dialog"
          role="dialog"
          aria-modal="true"
          aria-label="结果预览"
          tabindex="-1"
      >
        <header class="pc_preview_head">
          <span
              class="pc_preview_dot"
              :class="preview.direction === 'reverse' ? 'accent-reverse' : 'accent-forward'"
          />
          <div class="pc_preview_titles">
            <h2>{{ directionLabel }} · 第 {{ preview.iteration }} 次</h2>
            <p>{{ preview.batchText }} · {{ preview.dimsText }}</p>
          </div>
          <button
              type="button"
              class="pc_icon_button"
              title="关闭预览"
              aria-label="关闭预览"
              @click="store.closePreview"
          >
            <PCIconComp name="x" :size="15" color="#b8bec6"/>
          </button>
        </header>

        <div class="pc_preview_body">
          <div class="pc_preview_well">
            <template v-if="preview.image">
              <PCImageCanvasComp :image="preview.image.canvas" fit="contain"/>
            </template>
            <template v-else>
              <canvas ref="thumbRef" class="pc_preview_thumb"/>
              <div v-if="preview.status === 'loading'" class="pc_preview_overlay">
                <span class="pc_spinner"/>
                <strong>{{ preview.message }}</strong>
                <span class="pc_preview_percent">{{ Math.round(store.progress * 100) }}%</span>
              </div>
              <div v-else-if="preview.status === 'error'" class="pc_preview_overlay">
                <strong class="error">预览生成失败</strong>
                <span class="pc_preview_error">{{ preview.message }}</span>
              </div>
            </template>
          </div>
        </div>

        <footer class="pc_preview_footer">
          <div class="pc_preview_status">
            <span class="pc_preview_status_dot" :style="{ background: toneColor }"/>
            <span class="pc_preview_message" :title="preview.message">{{ preview.message }}</span>
          </div>
          <div class="pc_preview_actions">
            <button
                type="button"
                class="pc_small_button pc_small_secondary"
                :disabled="!actionsEnabled"
                @click="store.usePreviewAsSource"
            >
              <PCIconComp name="corner" :size="13"/>
              用作输入
            </button>
            <button
                type="button"
                class="pc_small_button pc_small_primary"
                :disabled="!actionsEnabled"
                @click="store.savePreviewImage"
            >
              <PCIconComp name="download" :size="13"/>
              保存 PNG
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped lang="sass">
.pc_preview_mask
  position: fixed
  inset: 0
  z-index: 3000
  background: rgba(12, 13, 15, .62)
  backdrop-filter: blur(3px)
  display: flex
  align-items: center
  justify-content: center
  padding: 24px
  font-size: 13px
.pc_preview_dialog
  width: min(1040px, 94vw)
  height: min(820px, 88vh)
  display: flex
  flex-direction: column
  background: var(--pc-surface)
  border: 1px solid var(--pc-line-strong)
  border-radius: 10px
  box-shadow: 0 24px 70px rgba(0, 0, 0, .55)
  overflow: hidden
  &:focus
    outline: none
.pc_preview_head
  flex: none
  min-height: 64px
  padding: 10px 14px 10px 18px
  border-bottom: 1px solid var(--pc-line)
  display: flex
  align-items: center
  gap: 10px
.pc_preview_dot
  width: 7px
  height: 7px
  border-radius: 50%
  flex: none
  &.accent-reverse
    background: var(--pc-ink)
  &.accent-forward
    background: var(--pc-rose)
.pc_preview_titles
  flex: 1
  min-width: 0
  h2
    margin: 0
    color: var(--pc-text-bright)
    font-size: 14px
    font-weight: 700
    line-height: 1.3
  p
    margin: 3px 0 0
    color: var(--pc-muted)
    font-size: 11px
    line-height: 1.3
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
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
  flex: none
  transition: background .2s ease, border-color .2s ease
  &:hover
    background: #35373b
    border-color: var(--pc-line-strong)
  &:focus-visible
    outline: 2px solid var(--pc-ink)
    outline-offset: 2px
.pc_preview_body
  flex: 1
  min-height: 0
  padding: 14px
  display: flex
.pc_preview_well
  position: relative
  flex: 1
  min-width: 0
  min-height: 0
  border: 1px solid var(--pc-line)
  border-radius: 8px
  background: var(--pc-field)
  overflow: hidden
  display: flex
  align-items: center
  justify-content: center
.pc_preview_thumb
  display: block
  max-width: 100%
  max-height: 100%
  opacity: .45
  filter: saturate(.7)
.pc_preview_overlay
  position: absolute
  inset: 0
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 7px
  background: rgba(30, 31, 34, .55)
  text-align: center
  padding: 16px
  strong
    color: var(--pc-text)
    font-size: 12px
    font-weight: 700
    &.error
      color: var(--pc-red)
  .pc_preview_error
    max-width: 520px
    color: var(--pc-red)
    font-size: 11px
    line-height: 1.6
    word-break: break-word
.pc_preview_percent
  color: var(--pc-faint)
  font-size: 11px
.pc_spinner
  width: 34px
  height: 34px
  border-radius: 50%
  border: 2px solid var(--pc-line-strong)
  border-top-color: var(--pc-ink)
  border-right-color: var(--pc-accent-light)
  animation: pc_preview_spin .8s linear infinite
@keyframes pc_preview_spin
  to
    transform: rotate(360deg)
.pc_preview_footer
  flex: none
  min-height: 60px
  padding: 0 14px 0 18px
  border-top: 1px solid var(--pc-line)
  display: flex
  align-items: center
  justify-content: space-between
  gap: 14px
.pc_preview_status
  min-width: 0
  display: flex
  align-items: center
  gap: 8px
.pc_preview_status_dot
  width: 7px
  height: 7px
  border-radius: 50%
  flex: none
.pc_preview_message
  min-width: 0
  max-width: 460px
  color: var(--pc-muted)
  font-size: 11px
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
.pc_preview_actions
  display: flex
  align-items: center
  gap: 8px
  flex: none
.pc_small_button
  height: 32px
  padding: 0 12px
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
@media (max-width: 720px)
  .pc_preview_mask
    padding: 10px
  .pc_preview_dialog
    width: 100%
    height: 92vh
  .pc_preview_footer
    flex-wrap: wrap
    padding-top: 8px
    padding-bottom: 8px
  .pc_preview_message
    max-width: 220px
</style>
