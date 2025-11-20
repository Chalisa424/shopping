<template>
  <button
    :type="type"
    :disabled="disabled"
    @click="$emit('click')"
    class=" rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400
            text-sm font-semibold text-white shadow-md
           transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    disabled: false,
  }
)

defineEmits<{
  (e: 'click'): void
}>()
</script>
