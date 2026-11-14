<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import PCImageCanvasComp from "@/components/PixelConfusion/PCImageCanvasComp.vue";
import { usePCToolStore } from "@/stores/PixelConfusion/PCToolStore";
import { usePCTheme } from "@/composables/usePCTheme";

const store = usePCToolStore();
const { isCute } = usePCTheme();
const thumbRef = ref<HTMLCanvasElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);

const preview = computed(() => store.preview);

const directionLabel = computed(() => (
    preview.value?.direction === "reverse" ? "反向结果" : "正向结果"
));

const toneColor = computed(() => {
    switch (preview.value?.tone) {
        case "ok":
            return isCute.value ? "var(--pc-mint)" : "#6ea4ff";
        case "busy":
            return isCute.value ? "var(--pc-warn)" : "var(--pc-pink)";
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
            <PCIconComp name="x" :size="15" :color="isCute ? 'var(--pc-muted)' : '#b8bec6'"/>
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
// 深色商务主题（默认）：7570a23 原版样式

@keyframes pc_preview_spin
  to
    transform: rotate(360deg)

html[data-pc-theme="dark"]
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

// 二次元主题：仅 html[data-pc-theme="cute"] 下生效

@keyframes pc_cute_pc_mask_in
  0%
    opacity: 0
  100%
    opacity: 1

@keyframes pc_cute_pc_dialog_in
  0%
    opacity: 0
    transform: translateY(18px) scale(.94)
  100%
    opacity: 1
    transform: translateY(0) scale(1)

@keyframes pc_cute_pc_preview_spin
  to
    transform: rotate(360deg)

@keyframes pc_cute_pc_preview_pulse
  0%, 100%
    box-shadow: 0 0 0 0 rgba(242, 88, 143, .3)
  60%
    box-shadow: 0 0 0 6px rgba(242, 88, 143, 0)

html[data-pc-theme="cute"]
  .pc_preview_mask
    position: fixed
    inset: 0
    z-index: 3000
    display: flex
    align-items: center
    justify-content: center
    padding: 24px
    background: rgba(255, 241, 246, .55)
    backdrop-filter: blur(10px) saturate(1.1)
    font-size: 13px
    animation: pc_cute_pc_mask_in .28s ease both
  .pc_preview_dialog
    width: min(1040px, 94vw)
    height: min(820px, 88vh)
    display: flex
    flex-direction: column
    background: linear-gradient(165deg, #fffdfb 0%, #fffefd 40%, #fff7f9 100%)
    border: 3px solid #ffffff
    border-radius: 28px
    box-shadow: 0 40px 90px rgba(178, 118, 148, .32), 0 0 0 1px rgba(240, 112, 158, .1), inset 0 2px 0 #ffffff
    overflow: hidden
    animation: pc_cute_pc_dialog_in .42s cubic-bezier(.22, .9, .32, 1.2) both
    &:focus
      outline: none
  .pc_preview_head
    flex: none
    min-height: 70px
    padding: 12px 16px 12px 22px
    border-bottom: 1px dashed #f6dfe8
    background: linear-gradient(180deg, rgba(255, 246, 250, .95), rgba(255, 255, 255, 0))
    display: flex
    align-items: center
    gap: 12px
  .pc_preview_dot
    width: 10px
    height: 10px
    border-radius: 4px
    flex: none
    &.accent-reverse
      background: linear-gradient(145deg, #a8d8ff, #6aaee8)
      box-shadow: 0 0 0 4px rgba(106, 174, 232, .16)
    &.accent-forward
      background: linear-gradient(145deg, #ffb3cf, #f2588f)
      box-shadow: 0 0 0 4px rgba(242, 88, 143, .16)
      animation: pc_cute_pc_preview_pulse 2.6s ease-out infinite
  .pc_preview_titles
    flex: 1
    min-width: 0
    h2
      margin: 0
      color: var(--pc-text-bright)
      font-family: var(--pc-font-round)
      font-size: 16px
      font-weight: 700
      letter-spacing: .5px
      line-height: 1.3
    p
      margin: 4px 0 0
      color: var(--pc-muted)
      font-size: 11px
      line-height: 1.3
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
  .pc_icon_button
    width: 36px
    height: 36px
    padding: 0
    border: 1px solid #ffe1ec
    border-radius: 50%
    background: linear-gradient(145deg, #ffffff, #fff2f8)
    display: inline-flex
    align-items: center
    justify-content: center
    cursor: pointer
    flex: none
    box-shadow: inset 0 1px 0 #ffffff, 0 3px 8px rgba(214, 146, 178, .14)
    transition: transform .3s ease, background .25s ease, border-color .25s ease, box-shadow .25s ease
    &:hover
      transform: rotate(90deg)
      background: #ffe9f2
      border-color: #ffb3d0
      box-shadow: 0 8px 18px rgba(240, 112, 158, .22)
    &:focus-visible
      outline: 3px solid rgba(239, 111, 159, .35)
      outline-offset: 2px
  .pc_preview_body
    flex: 1
    min-height: 0
    padding: 16px
    display: flex
  .pc_preview_well
    position: relative
    flex: 1
    min-width: 0
    min-height: 0
    border: 2px solid #ffffff
    border-radius: 20px
    background-color: var(--pc-field)
    background-image: radial-gradient(rgba(240, 112, 158, .09) 1.5px, transparent 1.5px)
    background-size: 18px 18px
    box-shadow: inset 0 3px 12px rgba(214, 146, 178, .08)
    overflow: hidden
    display: flex
    align-items: center
    justify-content: center
  .pc_preview_thumb
    display: block
    max-width: 100%
    max-height: 100%
    opacity: .45
    filter: saturate(.75)
  .pc_preview_overlay
    position: absolute
    inset: 0
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    gap: 8px
    padding: 16px
    background: rgba(255, 250, 247, .74)
    backdrop-filter: blur(3px)
    text-align: center
    strong
      color: var(--pc-text-bright)
      font-family: var(--pc-font-round)
      font-size: 13px
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
    padding: 2px 10px
    border-radius: 999px
    background: #fff0f6
    border: 1px solid #ffe1ec
    color: var(--pc-ink-deep)
    font-size: 11px
    font-weight: 700
  .pc_spinner
    width: 40px
    height: 40px
    border-radius: 50%
    border: 3px solid #ffe1ec
    border-top-color: var(--pc-rose)
    border-right-color: #ffb3d0
    box-shadow: 0 0 18px rgba(240, 112, 158, .22)
    animation: pc_cute_pc_preview_spin .85s linear infinite
  .pc_preview_footer
    flex: none
    min-height: 64px
    padding: 0 16px 0 22px
    border-top: 1px dashed #f6dfe8
    background: linear-gradient(180deg, rgba(255, 250, 252, .9), rgba(255, 245, 249, .9))
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
    width: 8px
    height: 8px
    border-radius: 50%
    flex: none
    box-shadow: 0 0 0 3px rgba(255, 255, 255, .9)
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
    gap: 9px
    flex: none
  .pc_small_button
    height: 34px
    padding: 0 15px
    border-radius: 999px
    border: 2px solid #ffffff
    font-family: inherit
    font-size: 11.5px
    font-weight: 700
    display: inline-flex
    align-items: center
    gap: 6px
    cursor: pointer
    transition: transform .28s cubic-bezier(.34, 1.56, .64, 1), box-shadow .28s ease, background .28s ease, opacity .28s ease
    &:disabled
      cursor: not-allowed
      background: #f8edf2
      border-color: #ffffff
      color: #cbb6c2
      box-shadow: none
    &:focus-visible
      outline: 3px solid rgba(239, 111, 159, .35)
      outline-offset: 2px
  .pc_small_secondary
    background: linear-gradient(145deg, #ffffff, #fff5fa)
    border-color: #ffe1ec
    color: var(--pc-text-bright)
    box-shadow: 0 4px 10px rgba(214, 146, 178, .12), inset 0 1px 0 #ffffff
    &:hover:not(:disabled)
      transform: translateY(-2px)
      background: #ffffff
      border-color: #ffb3d0
      box-shadow: 0 8px 18px rgba(240, 112, 158, .2)
  .pc_small_primary
    background: linear-gradient(135deg, #ffa6c6, #f0709e 60%, #e85b8f)
    color: #ffffff
    box-shadow: var(--pc-glow), inset 0 1px 0 rgba(255, 255, 255, .5)
    &:hover:not(:disabled)
      transform: translateY(-2px)
      filter: brightness(1.03)
      box-shadow: 0 10px 22px rgba(240, 112, 158, .38)
  @media (max-width: 720px)
    .pc_preview_mask
      padding: 10px
      backdrop-filter: blur(6px)
    .pc_preview_dialog
      width: 100%
      height: 92vh
      border-radius: 24px
    .pc_preview_head
      min-height: 62px
      padding: 10px 12px 10px 16px
    .pc_preview_body
      padding: 10px
    .pc_preview_footer
      flex-wrap: wrap
      padding-top: 8px
      padding-bottom: 8px
      padding-left: 14px
      padding-right: 12px
    .pc_preview_message
      max-width: 220px
  @media (prefers-reduced-motion: reduce)
    .pc_preview_mask, .pc_preview_dialog, .pc_preview_dot, .pc_spinner
      animation: none
</style>
