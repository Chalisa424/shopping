<template>
    <nav aria-label="Pagination" class="flex items-center justify-between gap-4">
    <!-- ปุ่ม Previous / หมายเลขหน้า -->
    <ul class="flex -space-x-px text-sm">
      <!-- Previous -->
      <li>
        <button
          type="button"
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
          class="flex items-center justify-center px-3 h-9 rounded-s-lg border
                 border-slate-300 bg-white text-slate-600
                 hover:bg-slate-100 hover:text-slate-800
                 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
                 shadow-sm"
        >
          Previous
        </button>
      </li>

      <!-- หมายเลขหน้า -->
      <li v-for="page in pages" :key="page">
        <button
          type="button"
          @click="goToPage(page)"
          :class="[
            'flex items-center justify-center w-9 h-9 border text-sm font-medium focus:outline-none',
            page === currentPage
              ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
              : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800'
          ]"
        >
          {{ page }}
        </button>
      </li>

      <!-- Next -->
      <li>
        <button
          type="button"
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
          class="flex items-center justify-center px-3 h-9 rounded-e-lg border
                 border-slate-300 bg-white text-slate-600
                 hover:bg-slate-100 hover:text-slate-800
                 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
                 shadow-sm"
        >
          Next
        </button>
      </li>
    </ul>

    <!-- page size -->
    <div class="w-32">
      <label class="sr-only" for="page-size">จำนวนต่อหน้า</label>
      <select
        id="page-size"
        :value="pageSize"
        @change="onPageSizeChange"
        class="block w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white
               text-sm text-slate-700 shadow-sm focus:ring-emerald-400 focus:border-emerald-400"
      >
        <option
          v-for="size in pageSizeOptions"
          :key="size"
          :value="size"
        >
          {{ size }} per page
        </option>
      </select>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    currentPage: number
    totalPages: number
    pageSize: number
    pageSizeOptions?: number[]
}>(), {
    pageSize: 10,
    pageSizeOptions: () => [10, 20, 50, 100],
});

const emit = defineEmits<{
    (e: 'update:currentPage', value: number): void
    (e: 'update:pageSize', value: number): void
    (e: 'change', value: {page: number; pageSize: number}): void
}>()

const pages = computed(() => {
    return Array.from({ length: props.totalPages }, (_,i) => i + 1)
})

const goToPage =(page: number) => {
    if (page < 1 || page > props.totalPages || page === props.currentPage) return
    emit('update:currentPage', page)
    emit('change', {page, pageSize: props.pageSize})
}

const onPageSizeChange = (event: Event) =>{
    const value = Number((event.target as HTMLSelectElement).value)
    emit('update:pageSize', value)
    emit('update:currentPage', 1)
    emit('change', {page:1, pageSize: value})    
}
</script>
