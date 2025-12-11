<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div
      class="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6 md:p-7 relative"
    >
      <button
        type="button"
        class="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        @click="$emit('cancel')"
      >
        ✕
      </button>

      <!-- หัวข้อ -->
      <h2 class="text-lg md:text-xl font-bold text-rose-600 text-center mb-3">
        ลบสินค้า
      </h2>

      <!-- ข้อความ -->
      <p class="text-sm text-slate-700 text-center mb-6">
        ต้องการลบสินค้า
        <span class="font-semibold">"{{ productName }}"</span>
        ใช่หรือไม่?
      </p>

      <!-- ปุ่ม -->
      <div class="mt-2 flex justify-center gap-3">
        <button
          type="button"
          class="rounded-full border border-slate-200 px-5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          @click="$emit('cancel')"
          :disabled="loading"
        >
          ยกเลิก
        </button>

        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed"
          @click="$emit('confirm')"
          :disabled="loading"
        >
          <span v-if="!loading">ลบสินค้า</span>
          <span v-else>กำลังลบ...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  productName: string;
  loading?: boolean;
}>();
</script>
