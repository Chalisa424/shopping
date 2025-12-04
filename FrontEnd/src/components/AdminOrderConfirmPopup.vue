<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div class="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
      <h2 class="text-center text-lg font-bold text-red-600">
        {{ title }}
      </h2>

      <p class="text-center text-slate-600 mt-3">
        {{ message }}
      </p>

      <!-- ปุ่ม -->
      <div class="flex justify-center gap-4 mt-6">
        <button
          @click="$emit('cancel')"
          class="px-6 py-2 rounded-lg bg-slate-200 hover:bg-slate-300"
        >
          ยกเลิก
        </button>

        <button
          @click="$emit('confirm')"
          class="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          ยืนยัน
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  title: string;
  message: string;
}>();

defineEmits(["confirm", "cancel"]);
</script>
