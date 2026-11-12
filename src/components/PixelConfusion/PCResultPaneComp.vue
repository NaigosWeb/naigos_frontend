<script setup lang="ts">
import PCIconComp from "@/components/PixelConfusion/PCIconComp.vue";
import PCResultTileComp from "@/components/PixelConfusion/PCResultTileComp.vue";
import type { PCBatchItemImpl, PCResultPaneImpl } from "@/interfaces/PixelConfusionImpl";

const props = withDefaults(defineProps<{
    pane: PCResultPaneImpl;
    disabled?: boolean;
}>(), {
    disabled: false
});

const emit = defineEmits<{
    open: [item: PCBatchItemImpl];
}>();

const accentName = () => {
    if (props.pane.direction === "reverse") return "reverse";
    if (props.pane.direction === "forward") return "forward";
    return "neutral";
};
</script>

<template>
  <section class="pc_result_pane">
    <header class="pc_result_head">
      <span class="pc_result_dot" :class="`accent-${accentName()}`"/>
      <h3 class="pc_result_title">{{ pane.title }}</h3>
      <span class="pc_result_meta">{{ pane.meta }}</span>
    </header>

    <div class="pc_result_well">
      <div v-if="!pane.items.length" class="pc_result_empty">
        <span class="pc_empty_icon">
          <PCIconComp name="sparkles" :size="17" color="var(--pc-rose)"/>
        </span>
        <strong>{{ pane.placeholderTitle }}</strong>
        <span>{{ pane.placeholderSubtitle }}</span>
      </div>
      <div v-else class="pc_result_grid">
        <PCResultTileComp
            v-for="item in pane.items"
            :key="`${item.direction}-${item.iteration}`"
            :item="item"
            :accent="pane.direction === 'reverse' ? 'reverse' : 'forward'"
            :disabled="disabled"
            @open="emit('open', item)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="sass">
@keyframes pc_pane_dot
  0%, 100%
    box-shadow: 0 0 0 0 rgba(242, 88, 143, .3)
  60%
    box-shadow: 0 0 0 5px rgba(242, 88, 143, 0)
@keyframes pc_empty_bob
  0%, 100%
    transform: translateY(0) rotate(-2deg)
  50%
    transform: translateY(-3px) rotate(2deg)
.pc_result_pane
  min-width: 0
  min-height: 0
  display: flex
  flex-direction: column
.pc_result_head
  height: 20px
  padding: 0 2px
  display: flex
  align-items: center
  gap: 7px
.pc_result_dot
  width: 8px
  height: 8px
  border-radius: 3px
  flex: none
  background: var(--pc-faint)
  &.accent-reverse
    background: linear-gradient(145deg, #a8d8ff, #6aaee8)
    box-shadow: 0 0 0 3px rgba(106, 174, 232, .16)
  &.accent-forward
    background: linear-gradient(145deg, #ffb3cf, #f2588f)
    box-shadow: 0 0 0 3px rgba(242, 88, 143, .16)
    animation: pc_pane_dot 2.6s ease-out infinite
  &.accent-neutral
    background: linear-gradient(145deg, #e2d5f6, #b39ddb)
.pc_result_title
  margin: 0
  color: var(--pc-text-bright)
  font-family: "BAFJ_CU", "Microsoft YaHei UI", sans-serif
  font-size: 13px
  font-weight: 700
  letter-spacing: .3px
  white-space: nowrap
.pc_result_meta
  margin-left: auto
  padding: 2px 8px
  border-radius: 999px
  background: #fff7fa
  border: 1px solid #ffe9f1
  color: var(--pc-faint)
  font-size: 10.5px
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  box-shadow: inset 0 1px 0 #ffffff
  &:empty
    display: none
.pc_result_well
  flex: 1
  min-height: 0
  margin-top: 8px
  padding: 9px
  border: 1px solid #fbe5ee
  border-radius: 18px
  background-color: var(--pc-field)
  background-image: radial-gradient(rgba(240, 112, 158, .08) 1.5px, transparent 1.5px)
  background-size: 17px 17px
  box-shadow: inset 0 3px 9px rgba(214, 146, 178, .06)
  overflow-y: auto
  overflow-x: hidden
  scrollbar-width: thin
  scrollbar-color: #ffc2d8 transparent
  &::-webkit-scrollbar
    width: 8px
  &::-webkit-scrollbar-track
    background: transparent
  &::-webkit-scrollbar-thumb
    background: #ffd0e2
    border-radius: 999px
    border: 2px solid #fffaf5
  &::-webkit-scrollbar-thumb:hover
    background: #f7a8c6
.pc_result_grid
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr))
  gap: 10px
  align-content: start
.pc_result_empty
  height: 100%
  min-height: 220px
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 4px
  padding: 16px
  text-align: center
  strong
    color: var(--pc-text-bright)
    font-family: "BAFJ_CU", "Microsoft YaHei UI", sans-serif
    font-size: 13px
    font-weight: 700
    letter-spacing: .3px
  > span:not(.pc_empty_icon)
    color: var(--pc-muted)
    font-size: 11.5px
  .pc_empty_icon
    width: 48px
    height: 48px
    margin-bottom: 6px
    border: 2px solid #ffffff
    border-radius: 17px
    background: linear-gradient(145deg, #fff3f8, #ffe6f1)
    display: inline-flex
    align-items: center
    justify-content: center
    box-shadow: 0 8px 18px rgba(240, 112, 158, .16), inset 0 1px 0 #ffffff
    animation: pc_empty_bob 4.8s ease-in-out infinite
@media (max-width: 1080px)
  .pc_result_well
    max-height: 56vh
@media (prefers-reduced-motion: reduce)
  .pc_result_dot, .pc_result_empty .pc_empty_icon
    animation: none
</style>
