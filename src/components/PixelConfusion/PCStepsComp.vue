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
@keyframes pc_step_glow
  0%, 100%
    box-shadow: 0 0 0 4px rgba(239, 111, 159, .14)
  50%
    box-shadow: 0 0 0 6px rgba(239, 111, 159, .05)
.pc_steps
  display: flex
  align-items: center
  gap: 5px
  white-space: nowrap
.pc_step_dot
  width: 8px
  height: 8px
  border-radius: 3px
  background: #f3dbe6
  flex: none
  transition: background .3s ease, transform .3s ease
  &.active
    background: linear-gradient(145deg, #ffb3cf, #ef6f9f)
    transform: scale(1.12)
    animation: pc_step_glow 2.4s ease-in-out infinite
  &.done
    background: linear-gradient(145deg, #a8e8cd, #59c59a)
.pc_step_label
  font-size: 11.5px
  font-weight: 700
  color: var(--pc-faint)
  transition: color .3s ease, transform .3s ease
  &.active
    color: var(--pc-ink-deep)
    transform: translateY(-1px)
  &.done
    color: var(--pc-muted)
.pc_step_line
  width: 13px
  height: 2px
  border-radius: 2px
  background: linear-gradient(90deg, #f6d9e6, #ffeaf3)
  margin: 0 4px
  flex: none
@media (max-width: 720px)
  .pc_step_label
    display: none
  .pc_step_line
    width: 8px
    margin: 0 2px
@media (prefers-reduced-motion: reduce)
  .pc_step_dot.active
    animation: none
</style>
