<template>
  <div
    class="mt-20 p-10 rounded-3xl bg-white shadow-lg overflow-hidden border border-slate-100"
  >
    <!-- ชื่อหัวข้อ -->
    <h1 class="text-lg md:text-xl font-bold text-slate-900">
      {{ title }}
    </h1>

    <!-- แถบปุ่ม filter -->
    <div class="mt-4 border-b border-slate-200 pb-4">
      <div
        class="flex overflow-hidden rounded-2xl bg-slate-50 text-xs md:text-sm font-medium text-slate-500"
      >
        <button
          type="button"
          class="flex-1 py-2 text-center transition"
          :class="activeStatus === 'ALL'
            ? 'bg-emerald-500 text-white'
            : 'hover:bg-slate-100'"
          @click="activeStatus = 'ALL'"
        >
          {{ labels.all }}
        </button>

        <button
          type="button"
          class="flex-1 py-2 text-center transition"
          :class="activeStatus === 'PENDING'
            ? 'bg-emerald-500 text-white'
            : 'hover:bg-slate-100'"
          @click="activeStatus = 'PENDING'"
        >
          {{ labels.pending }}
        </button>

        <button
          type="button"
          class="flex-1 py-2 text-center transition"
          :class="activeStatus === 'CONFIRMED'
            ? 'bg-emerald-500 text-white'
            : 'hover:bg-slate-100'"
          @click="activeStatus = 'CONFIRMED'"
        >
          {{ labels.confirmed }}
        </button>

        <button
          type="button"
          class="flex-1 py-2 text-center transition"
          :class="activeStatus === 'CANCELLED'
            ? 'bg-emerald-500 text-white'
            : 'hover:bg-slate-100'"
          @click="activeStatus = 'CANCELLED'"
        >
          {{ labels.cancelled }}
        </button>
      </div>
    </div>

    <!-- แถวหัวคอลัมน์ -->
    <div
      class="hidden bg-slate-50 px-6 py-2 text-[11px] font-semibold text-slate-500 md:flex md:items-center md:gap-4"
    >
      <div class="w-24">{{ columnLabels.code }}</div>
      <div class="w-40 text-center">{{ columnLabels.items }}</div>
      <div class="w-32 text-center">{{ columnLabels.total }}</div>
      <div class="flex-1 text-left md:text-center">{{ columnLabels.status }}</div>
      <div class="w-5"></div>
    </div>

    <!-- เนื้อหาด้านในทั้งหมด (โหลด / error / รายการ) -->
    <div class="px-4 pb-4 pt-2 md:px-6">
      <!-- loading / error -->
      <div v-if="loadingComputed" class="py-10 text-center text-slate-500 text-sm">
        {{ labels.loadingText }}
      </div>
      <div v-else-if="errorComputed" class="py-10 text-center text-red-500 text-sm">
        {{ errorComputed }}
      </div>

      <!-- รายการสั่งซื้อ -->
      <div v-else>
        <div
          v-if="filteredOrders.length === 0"
          class="py-10 text-center text-sm text-slate-500"
        >
          {{ labels.emptyText }}
        </div>

        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="border-b border-slate-100 py-4 last:border-b-0"
        >
          <!-- แถว summary -->
          <button
            type="button"
            class="flex w-full items-center gap-4 text-left"
            @click="toggleExpand(order.id)"
          >
            <div class="w-24 text-sm font-semibold text-slate-700">
              {{ order.orderCode }}
            </div>

            <div class="w-40 text-xs text-slate-500 text-center">
              {{ order.totalItems }} รายการ {{ order.totalQuantity }} ชิ้น
            </div>

            <div class="w-32 text-sm font-semibold text-rose-500 text-center">
              ฿{{ order.totalPrice }}
            </div>

            <div class="flex-1 text-xs font-medium">
              <span
                class="inline-flex rounded-full px-3 py-1"
                :class="statusBadgeClass(order.status)"
              >
                {{ statusText(order.status) }}
              </span>
            </div>

            <div class="text-slate-400">
              <Icon
                :icon="expandedId === order.id ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                width="20"
                height="20"
              />
            </div>
          </button>

          <!-- รายละเอียดรายการสั่งซื้อ -->
          <div
            v-if="expandedId === order.id"
            class="mt-3 rounded-2xl bg-slate-50/70 p-4 text-xs"
          >
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center gap-3 border-b border-slate-100 py-2 last:border-b-0"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="h-20 w-20 rounded-lg bg-white object-contain"
              />
              <div class="flex-1">
                <div class="font-semibold text-slate-800 text-sm">
                  {{ item.name }}
                </div>
                <div class="text-[11px] text-slate-500">
                  หมวดหมู่: {{ item.category }}
                </div>
              </div>
              <div class="w-16 text-center text-[11px] text-slate-600">
                x{{ item.quantity }}
              </div>
              <div class="w-20 text-right text-[11px] text-slate-600">
                ฿{{ item.price }}
              </div>
            </div>

            <div class="mt-3 text-right text-sm font-semibold text-emerald-600">
              รวมทั้งหมด: ฿{{ order.totalPrice }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { OrderModel, OrderStatus } from '../models/order.model'

const props = withDefaults(defineProps<{
  title: string
  orders: OrderModel[]
  loading: boolean
  error: string | null
  labels?: {
    all?: string
    pending?: string
    confirmed?: string
    cancelled?: string
    emptyText?: string
    loadingText?: string
  }
  columnLabels?: {
    code?: string
    items?: string
    total?: string
    status?: string
  }
}>(), {
  labels: () => ({
    all: 'ทั้งหมด',
    pending: 'รอการยืนยันคำสั่งซื้อ',
    confirmed: 'ยืนยันคำสั่งซื้อ',
    cancelled: 'ยกเลิกคำสั่งซื้อ',
    emptyText: 'ยังไม่มีรายการสั่งซื้อ',
    loadingText: 'กำลังโหลดรายการสั่งซื้อ...',
  }),
  columnLabels: () => ({
    code: 'รหัสการสั่งซื้อ',
    items: 'จำนวนสินค้า',
    total: 'ราคารวม',
    status: 'สถานะ',
  }),
})

const activeStatus = ref<'ALL' | OrderStatus>('ALL')
const expandedId = ref<number | null>(null)

const loadingComputed = computed(() => props.loading)
const errorComputed = computed(() => props.error)
const labels = computed(() => props.labels)
const columnLabels = computed(() => props.columnLabels)

const filteredOrders = computed(() => {
  if (activeStatus.value === 'ALL') return props.orders ?? []
  return (props.orders ?? []).filter(
    (o) => (o.status as string).toUpperCase() === activeStatus.value,
  )
})

// แปลง text ของ status
const statusText = (status: OrderStatus | string) => {
  const upper = status.toUpperCase()
  if (upper === 'PENDING') return labels.value.pending
  if (upper === 'CONFIRMED') return labels.value.confirmed
  if (upper === 'CANCELLED') return labels.value.cancelled
  return status
}

// class ป้ายสถานะ
const statusBadgeClass = (status: OrderStatus | string) => {
  const upper = status.toUpperCase()
  if (upper === 'PENDING') return 'bg-amber-100 text-amber-700'
  if (upper === 'CONFIRMED') return 'bg-emerald-100 text-emerald-700'
  if (upper === 'CANCELLED') return 'bg-rose-100 text-rose-700'
  return 'bg-slate-100 text-slate-600'
}

const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}
</script>
