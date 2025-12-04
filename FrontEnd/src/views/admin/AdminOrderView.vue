<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!-- navbar -->
    <navbar :cart-count="cartCount" />

    <!-- ใช้ component กลางสำหรับรายการสั่งซื้อ (เวอร์ชัน Admin) -->
    <OrderListCard
      title="จัดการการคำสั่งซื้อ"
      :orders="orders"
      :loading="loading"
      :error="error"
      :labels="{
        all: 'ทั้งหมด',
        pending: 'รอการยืนยันคำสั่งซื้อ',
        confirmed: 'ยืนยันคำสั่งซื้อ',
        cancelled: 'ยกเลิกคำสั่งซื้อ',
        emptyText: 'ยังไม่มีคำสั่งซื้อ',
        loadingText: 'กำลังโหลดคำสั่งซื้อ...',
      }"
      :column-labels="{
        code: 'รหัสการสั่งซื้อ',
        customer: 'ผู้สั่งซื้อ',
        items: 'จำนวนสินค้า',
        total: 'ราคารวม',
        status: 'สถานะ',
      }"
    />

    <!-- Popup หลังสั่งซื้อ (ถ้าจะใช้ใน Admin ก็ยังอยู่) -->
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
import navbar from "../../components/navbar.vue";
import { cartStore } from "../../stores/cart.store";
import type { OrderModel } from "../../models/order.model";
import { fetchMyOrders } from "../../services/orders.service";
import OrderSuccessPopup from "../../components/OrderSuccessPopup.vue";
import { authStore } from "../../stores/auth.store";
import OrderListCard from "../../components/AdminOrderList.vue";

const orders = ref<OrderModel[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const showOrderPopup = ref(false);
const popupTitle = ref("สั่งซื้อสินค้าเรียบร้อย");
const popupDetail = ref("");

const route = useRoute();
const cart = cartStore();

const cartCount = computed(() => cart.totalQuantity);

// ดึง order แล้วคำนวณ field ต่าง ๆ
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
        orderCode: String(o.id).padStart(6, "0"),
        status: (o.status ?? "PENDING").toUpperCase(),
        totalItems,
        totalQuantity,
        totalPrice,
        // เก็บ user ทั้งก้อนไว้ใช้ใน OrderListCard
        user: o.user ?? null,
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


onMounted(async () => {
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
