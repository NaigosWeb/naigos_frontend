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
  height: 30px
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
      color: #686c72
    .pc_toggle_track
      background: #35373b
      border-color: var(--pc-line-strong)
    .pc_toggle_knob
      background: #686c72
  &:focus-visible
    outline: 2px solid var(--pc-ink)
    outline-offset: 2px
    border-radius: 4px
.pc_toggle_label
  color: var(--pc-text)
  font-size: 12px
  line-height: 1.4
  transition: color .2s ease
.pc_toggle
  &:hover:not(:disabled) .pc_toggle_label
    color: var(--pc-text-bright)
.pc_toggle_track
  position: relative
  width: 38px
  height: 20px
  flex: none
  border-radius: 10px
  border: 1px solid var(--pc-line-strong)
  background: var(--pc-surface-alt)
  transition: background .2s ease, border-color .2s ease
.pc_toggle_knob
  position: absolute
  top: 50%
  left: 3px
  width: 12px
  height: 12px
  border-radius: 50%
  background: #ffffff
  transform: translateY(-50%)
  transition: left .2s ease
.pc_toggle.on
  .pc_toggle_track
    background: var(--pc-ink)
    border-color: var(--pc-accent-light)
  .pc_toggle_knob
    left: 21px
</style>
