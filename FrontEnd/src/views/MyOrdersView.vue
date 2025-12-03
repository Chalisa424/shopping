<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!-- navbar -->
    <navbar :cart-count="cartCount" />

    <div
      class="mt-20 p-10 rounded-3xl bg-white shadow-lg overflow-hidden border border-slate-100"
    >
      <!-- ชื่อหัวข้ออยู่ใน card -->
      <h1 class="text-lg md:text-xl font-bold text-slate-900">
        รายการสั่งซื้อของฉัน
      </h1>
      <div class="mt-4 border-b border-slate-200 pb-4">
        <!-- แถบปุ่ม filter แบบเมนูยาวเหมือนรูปตัวอย่าง -->
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
            ทั้งหมด
          </button>

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
            รอการยืนยันคำสั่งซื้อ
          </button>

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
            ยืนยันคำสั่งซื้อ
          </button>

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
            ยกเลิกคำสั่งซื้อ
          </button>
        </div>
      </div>

      <!-- แถวหัวคอลัมน์ -->
      <div
        class="hidden bg-slate-50 px-6 py-2 text-[11px] font-semibold text-slate-500 md:flex md:items-center md:gap-4"
      >
        <div class="w-24">รหัสการสั่งซื้อ</div>
        <div class="w-40 text-center">จำนวนสินค้า</div>
        <div class="w-32 text-center">ราคารวม</div>
        <div class="w-32 text-center">สถานะ</div>
      </div>

      <!-- เนื้อหาด้านในทั้งหมด (โหลด / error / รายการ) -->
      <div class="px-4 pb-4 pt-2 md:px-6">
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
                  :icon="
                    expandedId === order.id
                      ? 'mdi:chevron-up'
                      : 'mdi:chevron-down'
                  "
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

              <div
                class="mt-3 text-right text-sm font-semibold text-emerald-600"
              >
                รวมทั้งหมด: ฿{{ order.totalPrice }}
              </div>
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
import { authStore } from "../stores/auth.store";

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
const statusText = (status: OrderStatus | string) => {
  const upper = status.toUpperCase();
  if (upper === "PENDING") return "รอการยืนยันคำสั่งซื้อ";
  if (upper === "CONFIRMED") return "ยืนยันคำสั่งซื้อ";
  if (upper === "CANCELLED") return "ยกเลิกคำสั่งซื้อ";
  return status;
};

// class ป้ายสถานะ
const statusBadgeClass = (status: OrderStatus | string) => {
  const upper = status.toUpperCase();
  if (upper === "PENDING") return "bg-amber-100 text-amber-700";
  if (upper === "CONFIRMED") return "bg-emerald-100 text-emerald-700";
  if (upper === "CANCELLED") return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-600";
};

// ดึง order แล้วคำนวณ field ต่าง ๆ ให้เหมือนตัวอย่าง
const loadOrders = async () => {
  loading.value = true;
  error.value = null;

  try {
    const apiOrders: any[] = await fetchMyOrders();

    orders.value = apiOrders.map((o) => {
      const details = o.orderDetails ?? [];

      const totalItems = details.length;
      const totalQuantity = details.reduce(
        (sum: number, d: any) => sum + (d.quantity ?? 0),
        0
      );
      const totalPrice = details.reduce(
        (sum: number, d: any) => sum + (d.price ?? 0) * (d.quantity ?? 0),
        0
      );

      return {
        id: o.id,
        // ทำรหัส เช่น 000001
        orderCode: String(o.id).padStart(6, "0"),
        status: (o.status ?? "PENDING").toUpperCase(),
        totalItems,
        totalQuantity,
        totalPrice,
        // รายการสินค้าสำหรับตอนกดดูรายละเอียด
        items: details.map((d: any) => ({
          id: d.id,
          name: d.productName,
          image: d.productImageUrl,
          category: d.productCategory,
          quantity: d.quantity,
          price: d.price,
        })),
      } as unknown as OrderModel;
    });
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
    (o) => (o.status as string).toUpperCase() === activeStatus.value
  );
});

const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id;
};

onMounted(async () => {
  // ดึงข้อมูล user เผื่อ backend ใช้ userId จาก token
  const auth = authStore();
  await auth.fetchUser();

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
