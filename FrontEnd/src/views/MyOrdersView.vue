<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!-- navbar -->
    <navbar :cart-count="cartCount" />

    <!-- OrderListCard กลางสำหรับรายการสั่งซื้อ -->
    <OrderListCard
      :title="'รายการสั่งซื้อของฉัน'"
      :orders="orders"
      :loading="loading"
      :error="error"
      @cancel-order="handleCancelOrder"
    />

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
import Navbar from "../components/Navbar.vue";
import { cartStore } from "../stores/cart.store";
import type { OrderModel, OrderStatus } from "../models/order.model";
import { fetchMyOrders } from "../services/orders.service";
import OrderSuccessPopup from "../components/OrderSuccessPopup.vue";
import { authStore } from "../stores/auth.store";
import OrderListCard from "../components/OrderList.vue";
import { updateOrderStatus } from "../services/orders.service";

const orders = ref<OrderModel[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const showOrderPopup = ref(false);
const popupTitle = ref("สั่งซื้อสินค้าเรียบร้อย");
const popupDetail = ref("");

const route = useRoute();
const cart = cartStore();

const cartCount = computed(() => cart.totalQuantity);

/** แปลงสถานะจาก API -> รูปแบบที่หน้าเว็บใช้ */
const mapApiStatus = (apiStatus: string | null | undefined): OrderStatus => {
  const s = (apiStatus ?? "").toLowerCase();

  if (s === "pending") return "PENDING";
  if (s === "confirm" || s === "confirmed") return "CONFIRMED";
  if (s === "reject" || s === "rejected") return "REJECT";
  if (s === "cancel" || s === "cancelled") return "CANCELLED";

  return "PENDING";
};

// ดึง order แล้วคำนวณ field
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
        status: mapApiStatus(o.status),
        totalItems,
        totalQuantity,
        totalPrice,
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

const handleCancelOrder = async (orderId: number) => {
  try {
    await updateOrderStatus(orderId, "CANCELLED");

    // อัปเดต status ในหน้าเลย
    orders.value = orders.value.map((o) =>
      o.id === orderId ? { ...o, status: "CANCELLED" } : o
    );
  } catch (e) {
    console.error(e);
    error.value = "ยกเลิกคำสั่งซื้อไม่สำเร็จ";
  }
};
</script>
