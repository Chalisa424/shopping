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
          :class="
            activeStatus === 'ALL'
              ? 'bg-emerald-500 text-white'
              : 'hover:bg-slate-100'
          "
          @click="activeStatus = 'ALL'"
        >
          {{ labelsComputed.all }}
        </button>

        <!-- รอการยืนยัน -->
        <button
          type="button"
          class="flex-1 py-2 text-center transition"
          :class="
            activeStatus === 'PENDING'
              ? 'bg-emerald-500 text-white'
              : 'hover:bg-slate-100'
          "
          @click="activeStatus = 'PENDING'"
        >
          {{ labelsComputed.pending }}
        </button>

        <!-- ยืนยันคำสั่งซื้อ -->
        <button
          type="button"
          class="flex-1 py-2 text-center transition"
          :class="
            activeStatus === 'CONFIRMED'
              ? 'bg-emerald-500 text-white'
              : 'hover:bg-slate-100'
          "
          @click="activeStatus = 'CONFIRMED'"
        >
          {{ labelsComputed.confirmed }}
        </button>

        <!-- ปฏิเสธคำสั่งซื้อ -->
        <button
          type="button"
          class="flex-1 py-2 text-center transition"
          :class="
            activeStatus === 'REJECT'
              ? 'bg-emerald-500 text-white'
              : 'hover:bg-slate-100'
          "
          @click="activeStatus = 'REJECT'"
        >
          {{ labelsComputed.refuse }}
        </button>

        <!-- ยกเลิกคำสั่งซื้อ -->
        <button
          type="button"
          class="flex-1 py-2 text-center transition"
          :class="
            activeStatus === 'CANCELLED'
              ? 'bg-emerald-500 text-white'
              : 'hover:bg-slate-100'
          "
          @click="activeStatus = 'CANCELLED'"
        >
          {{ labelsComputed.cancelled }}
        </button>
      </div>
      <!-- แถบปุ่มยืนยัน/ปฏิเสธ -->
      <div v-if="showSelection" class="mt-4">
        <AdminOrderAction
          v-show="selectedIds.length > 0"
          :selected-count="selectedIds.length"
          @confirm-selected="handleConfirmClick"
          @reject-selected="handleRejectClick"
        />
      </div>
    </div>

    <!-- เนื้อหา -->
    <div class="px-2 md:px-2 pb-4 pt-2">
      <!-- Loading -->
      <div
        v-if="loadingComputed"
        class="py-10 text-center text-slate-500 text-sm"
      >
        {{ labelsComputed.loadingText }}
      </div>

      <!-- Error -->
      <div
        v-else-if="errorComputed"
        class="py-10 text-center text-red-500 text-sm"
      >
        {{ errorComputed }}
      </div>

      <!-- มีรายการ -->
      <div v-else>
        <div
          v-if="filteredOrders.length === 0"
          class="py-10 text-center text-sm text-slate-500"
        >
          {{ labelsComputed.emptyText }}
        </div>

        <!-- ตารางหลัก -->
        <table v-else class="w-full mt-3 text-[12px] text-slate-700">
          <!-- หัวคอลัมน์ -->
          <thead class="bg-slate-50 text-slate-500 font-semibold">
            <tr>
              <!--  หัว checkbox -->
              <th v-if="showSelection" class="w-[6%] px-4 py-2 text-center">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-emerald-500"
                  :checked="allSelected"
                  @change.stop="toggleSelectAll"
                />
              </th>

              <!-- รหัสการสั่งซื้อ -->
              <th class="w-[16%] px-4 py-2 text-center">
                {{ columnLabelsComputed.code }}
              </th>

              <!-- ผู้สั่งซื้อ -->
              <th
                v-if="hasCustomerColumn"
                class="w-[20%] px-4 py-2 text-center"
              >
                {{ columnLabelsComputed.customer }}
              </th>

              <!-- จำนวนสินค้า -->
              <th class="w-[18%] px-4 py-2 text-center">
                {{ columnLabelsComputed.items }}
              </th>

              <!-- ราคารวม -->
              <th class="w-[16%] px-4 py-2 text-center">
                {{ columnLabelsComputed.total }}
              </th>

              <!-- สถานะ -->
              <th class="w-[20%] px-4 py-2 text-center">
                {{ columnLabelsComputed.status }}
              </th>

              <!-- toggle icon -->
              <th class="w-[6%] px-2 py-2"></th>
            </tr>
          </thead>

          <tbody>
            <template v-for="order in filteredOrders" :key="order.id">
              <tr
                class="cursor-pointer hover:bg-slate-50 transition border-b border-slate-100"
                @click="toggleExpand(order.id)"
              >
                <!-- checkbox เลือกแถว -->
                <td
                  v-if="showSelection"
                  class="w-[6%] px-4 py-2 text-center"
                  @click.stop
                >
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-emerald-500"
                    :checked="isSelected(order.id)"
                    @change.stop="toggleSelect(order.id)"
                  />
                </td>

                <!-- รหัสการสั่งซื้อ -->
                <td
                  class="w-[16%] px-4 py-2 text-sm font-semibold text-slate-700 text-center"
                >
                  {{ order.orderCode }}
                </td>

                <!-- ผู้สั่งซื้อ -->
                <td
                  v-if="hasCustomerColumn"
                  class="w-[28%] px-4 py-2 align-middle"
                >
                  <div class="text-xs text-slate-700 leading-snug text-left">
                    <div class="font-semibold text-center">
                      Name: {{ getCustomerName(order) || "-" }}
                    </div>
                    <div class="text-[11px] px-16 text-slate-500">
                      Username: {{ getCustomerUsername(order) || "-" }}
                    </div>
                    <div class="text-[11px] px-16 text-slate-500">
                      เบอร์โทร: {{ getCustomerPhone(order) || "-" }}
                    </div>
                  </div>
                </td>

                <!-- จำนวนสินค้า -->
                <td
                  class="w-[18%] px-4 py-2 text-xs text-slate-500 text-center"
                >
                  {{ order.totalItems }} รายการ {{ order.totalQuantity }} ชิ้น
                </td>

                <!-- ราคารวม -->
                <td
                  class="w-[16%] px-4 py-2 text-sm font-semibold text-rose-500 text-center"
                >
                  ฿{{ order.totalPrice }}
                </td>

                <!-- สถานะ -->
                <td class="w-[16%] px-4 py-2 text-center">
                  <span
                    class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                    :class="statusBadgeClass(order.status)"
                  >
                    {{ statusText(order.status) }}
                  </span>
                </td>

                <!-- toggle icon -->
                <td
                  class="w-[6%] px-2 py-2 text-slate-400 text-center align-middle"
                >
                  <Icon
                    :icon="
                      expandedId === order.id
                        ? 'mdi:chevron-up'
                        : 'mdi:chevron-down'
                    "
                    width="20"
                    height="20"
                  />
                </td>
              </tr>

              <!-- แถวรายละเอียด -->
              <tr v-if="expandedId === order.id">
                <td :colspan="hasCustomerColumn ? 6 : 5" class="pt-0">
                  <div class="mt-3 rounded-2xl bg-slate-50/70 p-4 text-xs">
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

                    <div
                      class="mt-3 text-right text-sm font-semibold text-emerald-600"
                    >
                      รวมทั้งหมด: ฿{{ order.totalPrice }}
                    </div>
                    <!-- ปุ่มยกเลิกคำสั่งซื้อ -->
                    <button
                      v-if="
                        !selectable &&
                        String(order.status).toUpperCase() === 'PENDING'
                      "
                      type="button"
                      class="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600"
                      @click.stop="emit('cancel-order', order.id)"
                    >
                      ยกเลิกการสั่งซื้อ
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import AdminOrderAction from "./AdminOrderAction.vue";
import type { OrderModel, OrderStatus } from "../models/order.model";

const props = withDefaults(
  defineProps<{
    title: string;
    orders: OrderModel[];
    loading: boolean;
    error: string | null;
    labels?: {
      all?: string;
      pending?: string;
      confirmed?: string;
      refuse?: string;
      cancelled?: string;
      emptyText?: string;
      loadingText?: string;
    };
    columnLabels?: {
      code?: string;
      customer?: string; // ใช้เฉพาะฝั่ง admin
      items?: string;
      total?: string;
      status?: string;
    };
    // เพิ่มสำหรับ admin
    selectable?: boolean;
    selectedIds?: number[];
  }>(),
  {
    labels: () => ({
      all: "ทั้งหมด",
      pending: "รอการยืนยันคำสั่งซื้อ",
      confirmed: "ยืนยันคำสั่งซื้อ",
      refuse: "ปฏิเสธการสั่งซื้อ",
      cancelled: "ยกเลิกคำสั่งซื้อ",
      emptyText: "ยังไม่มีรายการสั่งซื้อ",
      loadingText: "กำลังโหลดรายการสั่งซื้อ...",
    }),
    columnLabels: () => ({
      code: "รหัสการสั่งซื้อ",
      customer: "",
      items: "จำนวนสินค้า",
      total: "ราคารวม",
      status: "สถานะ",
    }),
    selectable: false,
    selectedIds: () => [],
  }
);

const emit = defineEmits<{
  (e: "update:selectedIds", value: number[]): void;
  (e: "confirm-selected", ids: number[]): void;
  (e: "reject-selected", ids: number[]): void;
  (e: "cancel-order", id: number): void;
}>();

const activeStatus = ref<"ALL" | OrderStatus>("ALL");
const expandedId = ref<number | null>(null);

const loadingComputed = computed(() => props.loading);
const errorComputed = computed(() => props.error);
const labelsComputed = computed(() => props.labels!);
const columnLabelsComputed = computed(() => props.columnLabels!);

const hasCustomerColumn = computed(
  () =>
    !!columnLabelsComputed.value.customer &&
    columnLabelsComputed.value.customer !== ""
);

const filteredOrders = computed(() => {
  if (activeStatus.value === "ALL") return props.orders ?? [];
  return (props.orders ?? []).filter(
    (o) => (o.status as string).toUpperCase() === activeStatus.value
  );
});

//  state การเลือก
const selectedIds = ref<number[]>([...(props.selectedIds ?? [])]);

watch(
  () => props.selectedIds,
  (val) => {
    if (val) {
      selectedIds.value = [...val];
    }
  }
);

const isSelected = (id: number) => selectedIds.value.includes(id);

const allSelected = computed(
  () =>
    filteredOrders.value.length > 0 &&
    filteredOrders.value.every((o) => selectedIds.value.includes(o.id))
);

const showSelection = computed(() => {
  if (!props.selectable) return false;

 return activeStatus.value === "ALL" || activeStatus.value === "PENDING";
});

const toggleSelect = (id: number) => {
  if (isSelected(id)) {
    selectedIds.value = selectedIds.value.filter((x) => x !== id);
  } else {
    selectedIds.value = [...selectedIds.value, id];
  }
  emit("update:selectedIds", selectedIds.value);
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = filteredOrders.value.map((o) => o.id);
  }
  emit("update:selectedIds", selectedIds.value);
};

const handleConfirmClick = () => {
  if (selectedIds.value.length === 0) return;
  emit("confirm-selected", selectedIds.value);
};

const handleRejectClick = () => {
  if (selectedIds.value.length === 0) return;
  emit("reject-selected", selectedIds.value);
};

// แปลง text ของ status
const statusText = (status: OrderStatus | string) => {
  const upper = status.toUpperCase();
  if (upper === "PENDING") return labelsComputed.value.pending;
  if (upper === "CONFIRMED") return labelsComputed.value.confirmed;
  if (upper === "REJECT" || upper === "REJECTED")
    return labelsComputed.value.refuse;
  if (upper === "CANCELLED" || upper === "CANCEL")
    return labelsComputed.value.cancelled;
  return status;
};

// class ป้ายสถานะ
const statusBadgeClass = (status: OrderStatus | string) => {
  const upper = status.toUpperCase();
  if (upper === "PENDING") return "bg-amber-100 text-amber-700";
  if (upper === "CONFIRMED") return "bg-emerald-100 text-emerald-700";
  if (upper === "REJECT" || upper === "REJECTED")
    return "bg-rose-100 text-rose-700";
  if (upper === "CANCELLED" || upper === "CANCEL")
    return "bg-slate-200 text-slate-700";
  return "bg-slate-100 text-slate-600";
};

const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id;
};

//ดึงข้อมูลผู้สั่งซื้อแบบแยก feild
const getCustomerName = (order: any) => {
  return order.customerName ?? order.user?.fullName ?? order.user?.name ?? "";
};

const getCustomerUsername = (order: any) => {
  return order.user?.username ?? order.username ?? "";
};

const getCustomerPhone = (order: any) => {
  return order.user?.phone ?? order.phone ?? "";
};
</script>
