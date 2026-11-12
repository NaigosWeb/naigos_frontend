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
          <PCIconComp name="sparkles" :size="16" color="#8b9098"/>
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
.pc_result_pane
  min-width: 0
  min-height: 0
  display: flex
  flex-direction: column
.pc_result_head
  height: 18px
  padding: 0 2px
  display: flex
  align-items: center
  gap: 7px
.pc_result_dot
  width: 6px
  height: 6px
  border-radius: 50%
  flex: none
  background: var(--pc-faint)
  &.accent-reverse
    background: var(--pc-ink)
  &.accent-forward
    background: var(--pc-rose)
.pc_result_title
  margin: 0
  color: var(--pc-text)
  font-size: 12px
  font-weight: 700
  white-space: nowrap
.pc_result_meta
  margin-left: auto
  color: var(--pc-faint)
  font-size: 11px
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
.pc_result_well
  flex: 1
  min-height: 0
  margin-top: 8px
  padding: 8px
  border: 1px solid var(--pc-line)
  border-radius: 6px
  background: var(--pc-field)
  overflow-y: auto
  overflow-x: hidden
  &::-webkit-scrollbar
    width: 8px
  &::-webkit-scrollbar-track
    background: transparent
  &::-webkit-scrollbar-thumb
    background: var(--pc-line-strong)
    border-radius: 4px
    border: 2px solid var(--pc-field)
  &::-webkit-scrollbar-thumb:hover
    background: #5c6066
.pc_result_grid
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr))
  gap: 8px
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
    color: var(--pc-text)
    font-size: 12px
    font-weight: 700
  > span:not(.pc_empty_icon)
    color: var(--pc-muted)
    font-size: 11px
  .pc_empty_icon
    width: 38px
    height: 34px
    margin-bottom: 3px
    border: 1px solid var(--pc-line)
    border-radius: 8px
    background: var(--pc-surface-alt)
    display: inline-flex
    align-items: center
    justify-content: center
@media (max-width: 1080px)
  .pc_result_well
    max-height: 56vh
</style>
