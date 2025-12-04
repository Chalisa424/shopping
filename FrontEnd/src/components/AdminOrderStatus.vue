<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <h2 class="text-lg font-bold text-center text-slate-800">
        {{ titleText }}
      </h2>

      <p class="mt-4 text-sm text-center text-slate-600">
        คุณต้องการเปลี่ยนสถานะการสั่งซื้อ
        <span class="font-semibold">{{ selectedCount }}</span>
        รายการเป็น
        <span class="font-semibold">
          {{ mode === "CONFIRM" ? "ยืนยันคำสั่งซื้อ" : "ปฏิเสธคำสั่งซื้อ" }}
        </span>
        หรือไม่?
      </p>

      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
          @click="$emit('cancel')"
        >
          ยกเลิก
        </button>

        <button
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          :class="mode === 'CONFIRM'
            ? 'bg-emerald-500 hover:bg-emerald-600'
            : 'bg-rose-500 hover:bg-rose-600'"
          @click="$emit('confirm')"
        >
          {{ mode === "CONFIRM" ? "ยืนยัน" : "ปฏิเสธ" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  show: boolean;
  mode: "CONFIRM" | "REJECT";
  selectedCount: number;
}>();

defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const titleText = computed(() =>
  props.mode === "CONFIRM" ? "ยืนยันคำสั่งซื้อ" : "ปฏิเสธคำสั่งซื้อ"
);
</script>