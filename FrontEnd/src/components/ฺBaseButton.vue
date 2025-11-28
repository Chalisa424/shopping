<template>
  <button
    :type="type"
    :disabled="disabled"
    @click="$emit('click')"
    class=" rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400
            text-sm font-semibold text-white shadow-md
            transition-all duration-150 ease-in-out 
            disabled:cursor-not-allowed disabled:opacity-60
            hover:shadow-lg active:scale-95 active:shadow-inner"
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
