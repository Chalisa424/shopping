<template>
  <div class="mt-6 mb-3 flex items-center gap-3">
    <!-- ปุ่มยืนยัน -->
    <button
      type="button"
      class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white
             bg-emerald-500 hover:bg-emerald-600 transition"
      @click="$emit('confirm-selected')"
    >
      <Icon icon="material-symbols:check-rounded" width="20" height="20" />
      ยืนยันคำสั่งซื้อ
      <span v-if="selectedCount > 0"> ({{ selectedCount }})</span>
    </button>

    <!-- ปุ่มปฏิเสธ -->
    <button
      type="button"
      class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white
             bg-rose-500 hover:bg-rose-600 transition"
      @click="$emit('reject-selected')"
    >
      <Icon icon="material-symbols:close-rounded" width="20" height="20" />
      ปฏิเสธการสั่งซื้อ
      <span v-if="selectedCount > 0"> ({{ selectedCount }})</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = defineProps<{
  selectedCount: number;
}>();

defineEmits<{
  (e: "confirm-selected"): void;
  (e: "reject-selected"): void;
}>();
</script>