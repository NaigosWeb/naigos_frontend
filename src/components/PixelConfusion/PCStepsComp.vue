<script setup lang="ts">
defineProps<{
    active: number;
}>();

const steps = [
    { label: "选图", value: 1 },
    { label: "参数", value: 2 },
    { label: "处理", value: 3 },
    { label: "保存", value: 4 }
];
</script>

<template>
  <div class="pc_steps" aria-label="操作步骤">
    <template v-for="(step, index) in steps" :key="step.value">
      <span
          class="pc_step_dot"
          :class="{ active: step.value === active, done: step.value < active }"
      />
      <span
          class="pc_step_label"
          :class="{ active: step.value === active, done: step.value < active }"
      >{{ step.label }}</span>
      <span v-if="index < steps.length - 1" class="pc_step_line"/>
    </template>
  </div>
</template>

<style scoped lang="sass">
.pc_steps
  display: flex
  align-items: center
  gap: 6px
  white-space: nowrap
.pc_step_dot
  width: 6px
  height: 6px
  border-radius: 50%
  background: #4a668f
  flex: none
  &.active
    background: var(--pc-ink)
  &.done
    background: var(--pc-accent-light)
.pc_step_label
  font-size: 12px
  color: var(--pc-faint)
  transition: color .2s ease
  &.active
    color: var(--pc-text-bright)
    font-weight: 700
  &.done
    color: var(--pc-muted)
.pc_step_line
  width: 14px
  height: 1px
  background: var(--pc-line-strong)
  margin: 0 4px
  flex: none
@media (max-width: 720px)
  .pc_step_label
    display: none
  .pc_step_line
    width: 8px
    margin: 0 2px
</style>
