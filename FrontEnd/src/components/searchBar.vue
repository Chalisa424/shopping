<template>
  <!-- Search -->
    <div class="mb-6 flex justify-center">
      <div class="relative w-full max-w-xl">
        <input
          :value="modelValue"
          @input="$emit('update:modelValue',($event.target as HTMLInputElement).value)"
          type="text"
          :placeholder="placeholder"
          class="w-full rounded-full border border-slate-300 px-4 py-2.5 pl-12 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
        />
        <!-- ปุ่มค้นหา -->
        <BaseButton
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center
             h-8 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400
             shadow-md hover:opacity-90 transition"
        @click="$emit('search')"
             >
        <Icon
          icon="material-symbols:search-rounded"
          width="20"
          height="20"
          class="text-white"
        />
        </BaseButton>
      </div>
    </div> 
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import BaseButton from './ฺBaseButton.vue'

defineProps<{
    modelValue: string
    placeholder?: string
}>()

defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'search'):void
}>()

</script>