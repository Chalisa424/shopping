<template>
  <div class="mb-4 flex gap-3">
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-emerald-600"
      @click="$emit('confirm-selected')"
    >
      <Icon icon="material-symbols:check-rounded" width="24" height="24" />
      ยืนยันคำสั่งซื้อ ({{ selectedCount }})
    </button>

    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-rose-600"
      @click="$emit('reject-selected')"
    >
      <Icon icon="material-symbols:close-rounded" width="24" height="24" />
      ปฏิเสธคำสั่งซื้อ ({{ selectedCount }})
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  selectedCount: number;
}>();

defineEmits<{
  (e: "confirm-selected"): void;
  (e: "reject-selected"): void;
}>();
</script>
