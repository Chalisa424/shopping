<template>
  <transition name="slide-up">
    <div
      v-if="show"
      class="fixed bottom-4 right-4 z-50 w-full max-w-sm"
    >
      <div
        class="flex items-start gap-3 rounded-2xl border border-emerald-100
               bg-white px-4 py-3 text-sm shadow-lg"
      >
        <!-- ไอคอนเช็ค -->
        <div class="mt-1 text-emerald-500">
          <Icon icon="mdi:check-circle-outline" width="24" height="24" />
        </div>

        <!-- ข้อความ -->
        <div class="flex-1">
          <p class="font-semibold text-slate-800">
            {{ titleText }}
          </p>
          <p class="mt-1 text-xs text-slate-600">
            {{ detailText }}
          </p>

          <button
            type="button"
            class="mt-2 inline-flex items-center gap-1 rounded-lg border
                   border-slate-200 px-3 py-1.5 text-[11px] font-medium
                   text-slate-700 hover:bg-slate-50"
            @click="$emit('view-detail')"
          >
            <Icon
              icon="material-symbols:list-alt-outline"
              width="16"
              height="16"
            />
            ดูรายละเอียดคำสั่งซื้อ
          </button>
        </div>

        <!-- ปุ่มปิด -->
        <button
          type="button"
          class="ml-2 text-slate-400 hover:text-slate-600"
          @click="$emit('close')"
        >
          <Icon icon="mdi:close" width="18" height="18" />
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  show: boolean;
  titleText: string;
  detailText: string;
}>();

defineEmits<{
  (e: "close"): void;
  (e: "view-detail"): void;
}>();
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
