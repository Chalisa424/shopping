<template>
  <footer
    class="fixed inset-x-0 bottom-0 border-t border-white/40 bg-white/80 backdrop-blur"
  >
    <div
      class="mx-auto flex max-w-[90rem] flex-col items-center justify-between gap-3 px-4 py-3 text-sm md:flex-row"
    >
      <div class="flex items-center gap-6">
        <!-- Checkbox เลือกทั้งหมด -->
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            :checked="allChecked"
            @change="$emit('select-all', ($event.target as HTMLInputElement).checked)"
            class="h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
          />
          <button
            type="button"
            class="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            @click="$emit('select-all', !allChecked)"
          >
            เลือกทั้งหมด
          </button>
        </div>

        <!-- ลบที่เลือก -->
        <button
          type="button"
          class="flex items-center gap-2 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors"
          @click="$emit('remove-selected')"
        >
          <Icon icon="tabler:trash-filled" width="24" height="24" />
          ลบที่เลือก
        </button>
      </div>

      <!-- ขวา -->
      <div class="flex items-center gap-4">
        <div class="text-xs md:text-sm text-slate-700">
          รวม (
          <span class="font-semibold">
            {{ selectedCount }} รายการ
          </span>
          ) :
          <span class="text-base font-bold text-emerald-600 md:text-lg">
            ฿{{ selectedTotal }}
          </span>
        </div>

        <BaseButton
          :disabled="selectedCount === 0"
          class="px-6 py-2 text-sm font-semibold"
          @click="$emit('checkout')"
        >
          สั่งสินค้า
        </BaseButton>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import BaseButton from "./ฺBaseButton.vue";
import { Icon } from "@iconify/vue";

defineProps<{
  selectedCount: number;
  selectedTotal: number;
  allChecked: boolean;
}>();

defineEmits<{
  (e: "select-all", checked: boolean): void;
  (e: "remove-selected"): void;
  (e: "checkout"): void;
}>();
</script>
