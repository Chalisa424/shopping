<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!-- ใช้ navbar เดียวกับฝั่ง shop ถ้ามี -->
    <navbar :cart-count="cartCount" />

    <h1
      class="mt-10 mb-6 text-center text-2xl font-bold text-slate-800"
    >
      รายการสั่งซื้อของฉัน
    </h1>

    <div class="rounded-3xl bg-white/95 p-6 shadow-lg">
      <!-- แถวปุ่ม filter -->
      <div class="mb-4 flex flex-wrap gap-3 text-sm">
        <button
          type="button"
          class="rounded-full px-4 py-1.5 font-medium"
          :class="activeStatus === 'ALL'
            ? 'bg-emerald-500 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          @click="activeStatus = 'ALL'"
        >
          ทั้งหมด
        </button>

        <button
          type="button"
          class="rounded-full px-4 py-1.5 font-medium"
          :class="activeStatus === 'PENDING'
            ? 'bg-emerald-500 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          @click="activeStatus = 'PENDING'"
        >
          รอการยืนยันคำสั่งซื้อ
        </button>

        <button
          type="button"
          class="rounded-full px-4 py-1.5 font-medium"
          :class="activeStatus === 'CONFIRMED'
            ? 'bg-emerald-500 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          @click="activeStatus = 'CONFIRMED'"
        >
          ยืนยันคำสั่งซื้อ
        </button>

        <button
          type="button"
          class="rounded-full px-4 py-1.5 font-medium"
          :class="activeStatus === 'CANCELLED'
            ? 'bg-emerald-500 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          @click="activeStatus = 'CANCELLED'"
        >
          ยกเลิกคำสั่งซื้อ
        </button>
      </div>

      <!-- loading / error -->
      <div v-if="loading" class="py-10 text-center text-slate-500 text-sm">
        กำลังโหลดรายการสั่งซื้อ...
      </div>
      <div v-else-if="error" class="py-10 text-center text-red-500 text-sm">
        {{ error }}
      </div>

      <!-- รายการสั่งซื้อ -->
      <div v-else>
        <div
          v-if="filteredOrders.length === 0"
          class="py-10 text-center text-sm text-slate-500"
        >
          ยังไม่มีรายการสั่งซื้อ
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

            <div class="w-40 text-xs text-slate-500">
              {{ order.totalItems }} รายการ {{ order.totalQuantity }} ชิ้น
            </div>

            <div class="w-32 text-sm font-semibold text-rose-500">
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
                :icon="expandedId === order.id
                  ? 'mdi:chevron-up'
                  : 'mdi:chevron-down'"
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
                class="h-10 w-10 rounded-lg bg-white object-contain"
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

    <!-- Popup หลังสั่งซื้อ -->
    <OrderSuccessPopup
      :show="showOrderPopup"
      :title-text="popupTitle"
      :detail-text="popupDetail"
      @close="showOrderPopup = false"
      @view-detail="showOrderPopup = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import navbar from "../components/navbar.vue";
import { cartStore } from "../stores/cart.store";
import { Icon } from "@iconify/vue";
import type { OrderModel, OrderStatus } from "../models/order.model";
import { fetchMyOrders } from "../services/orders.service";
import OrderSuccessPopup from "../components/OrderSuccessPopup.vue";


const orders = ref<OrderModel[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const activeStatus = ref<"ALL" | OrderStatus>("ALL");
const expandedId = ref<number | null>(null);

const showOrderPopup = ref(false);
const popupTitle = ref("สั่งซื้อสินค้าเรียบร้อย");
const popupDetail = ref("");

const route = useRoute();
const cart = cartStore();

// แสดงจำนวนใน navbar
const cartCount = computed(() => cart.totalQuantity);

// แปลง text ของ status
const statusText = (status: OrderStatus) => {
  if (status === "PENDING") return "รอการยืนยันคำสั่งซื้อ";
  if (status === "CONFIRMED") return "ยืนยันคำสั่งซื้อ";
  if (status === "CANCELLED") return "ยกเลิกคำสั่งซื้อ";
  return status;
};

// class ป้ายสถานะ
const statusBadgeClass = (status: OrderStatus) => {
  if (status === "PENDING")
    return "bg-amber-100 text-amber-700";
  if (status === "CONFIRMED")
    return "bg-emerald-100 text-emerald-700";
  if (status === "CANCELLED")
    return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-600";
};

const loadOrders = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await fetchMyOrders();
    orders.value = data;
  } catch (e) {
    console.error(e);
    error.value = "ไม่สามารถโหลดรายการสั่งซื้อได้";
  } finally {
    loading.value = false;
  }
};

// filter ตามสถานะ
const filteredOrders = computed(() => {
  if (activeStatus.value === "ALL") return orders.value;
  return orders.value.filter(
    (o) => o.status === activeStatus.value
  );
});

const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id;
};

onMounted(async () => {
  await loadOrders();

  if (route.query.success === "1") {
    const items = route.query.items ?? "";
    popupDetail.value =
      items !== ""
        ? `สั่งซื้อสินค้า ${items} รายการเรียบร้อยแล้ว`
        : "สั่งซื้อสินค้าเรียบร้อยแล้ว";
    showOrderPopup.value = true;
  }
});

</script>
