<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue: boolean;
    label: string;
    disabled?: boolean;
}>(), {
    disabled: false
});

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    change: [value: boolean];
}>();

const toggle = () => {
    if (props.disabled) return;
    const next = !props.modelValue;
    emit("update:modelValue", next);
    emit("change", next);
};
</script>

<template>
  <button
      type="button"
      class="pc_toggle"
      :class="{ on: modelValue }"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      @click="toggle"
  >
    <span class="pc_toggle_label">{{ label }}</span>
    <span class="pc_toggle_track">
      <span class="pc_toggle_knob"/>
    </span>
  </button>
</template>

<style scoped lang="sass">
.pc_toggle
  width: 100%
  height: 32px
  padding: 0
  border: 0
  background: transparent
  display: flex
  align-items: center
  justify-content: space-between
  gap: 10px
  cursor: pointer
  font-family: inherit
  &:disabled
    cursor: not-allowed
    .pc_toggle_label
      color: #cbb6c2
    .pc_toggle_track
      background: #f6e8ef
      border-color: #f2dde7
    .pc_toggle_knob
      background: #e5d2dc
      box-shadow: none
  &:focus-visible
    outline: 3px solid rgba(239, 111, 159, .3)
    outline-offset: 3px
    border-radius: 999px
.pc_toggle_label
  color: var(--pc-text-bright)
  font-size: 12px
  font-weight: 700
  line-height: 1.4
  transition: color .25s ease
.pc_toggle
  &:hover:not(:disabled) .pc_toggle_label
    color: var(--pc-ink-deep)
.pc_toggle_track
  position: relative
  width: 46px
  height: 26px
  flex: none
  border-radius: 999px
  border: 2px solid #f6dcea
  background: #f9eef3
  box-shadow: inset 0 2px 4px rgba(214, 146, 178, .1)
  transition: background .3s ease, border-color .3s ease, box-shadow .3s ease
.pc_toggle_knob
  position: absolute
  top: 50%
  left: 3px
  width: 16px
  height: 16px
  border-radius: 50%
  background: #ffffff
  transform: translateY(-50%)
  box-shadow: 0 2px 5px rgba(190, 120, 150, .28), inset 0 -1px 2px rgba(0, 0, 0, .04)
  transition: left .32s cubic-bezier(.34, 1.56, .64, 1), background .25s ease
.pc_toggle.on
  .pc_toggle_track
    background: linear-gradient(135deg, #ffb3cf, #f0709e 60%, #e85b8f)
    border-color: #ffffff
    box-shadow: 0 4px 12px rgba(240, 112, 158, .3), inset 0 1px 0 rgba(255, 255, 255, .4)
  .pc_toggle_knob
    left: 24px
    box-shadow: 0 2px 6px rgba(190, 60, 110, .3)
@media (prefers-reduced-motion: reduce)
  .pc_toggle_knob
    transition: none
</style>
