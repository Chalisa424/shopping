<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!-- navbar -->
    <navbar :cart-count="cartCount" />

    <!-- ใช้ component กลางสำหรับรายการสั่งซื้อ (เวอร์ชัน Admin) -->
    <AdminOrderList
      title="จัดการการคำสั่งซื้อ"
      :orders="orders"
      :loading="loading"
      :error="error"
      :labels="{
        all: 'ทั้งหมด',
        pending: 'รอการยืนยันคำสั่งซื้อ',
        confirmed: 'ยืนยันคำสั่งซื้อ',
        refuse: 'ปฏิเสธการสั่งซื้อ',
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
      selectable
      v-model:selected-ids="selectedIds"
      @confirm-selected="handleConfirmSelected"
      @reject-selected="handleRejectSelected"
    />

    <!-- popup ยืนยันเปลี่ยนสถานะ -->
    <AdminOrderStatus
      :show="showAdminStatus"
      :mode="adminStatusMode"
      :selected-count="selectedIds.length"
      @cancel="showAdminStatus = false"
      @confirm="handleAdminStatusConfirm"
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
import navbar from "../../components/navbar.vue";
import { cartStore } from "../../stores/cart.store";
import type { OrderModel } from "../../models/order.model";
import {
  fetchAdminOrders,
  updateOrderStatus,
} from "../../services/orders.service";
import OrderSuccessPopup from "../../components/OrderSuccessPopup.vue";
import AdminOrderList from "../../components/OrderList.vue";
import AdminOrderStatus from "../../components/AdminOrderStatus.vue";

const orders = ref<OrderModel[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// id ของ order checkbox
const selectedIds = ref<number[]>([]);

// popup หลังสั่งซื้อสำเร็จ (ของเดิม)
const showOrderPopup = ref(false);
const popupTitle = ref("สั่งซื้อสินค้าเรียบร้อย");
const popupDetail = ref("");

// popup ยืนยันเปลี่ยนสถานะ (ใหม่)
const showAdminStatus = ref(false);
const adminStatusMode = ref<"CONFIRM" | "REJECT">("CONFIRM");

const route = useRoute();
const cart = cartStore();

const cartCount = computed(() => cart.totalQuantity);

// ดึง order แล้วคำนวณ field ต่าง ๆ
const loadOrders = async () => {
  loading.value = true;
  error.value = null;

  try {
    const apiOrders: any[] = await fetchAdminOrders();

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

// เมื่อกดปุ่ม “ยืนยันคำสั่งซื้อ” ด้านบน (ปุ่มเขียว)
const handleConfirmSelected = () => {
  if (selectedIds.value.length === 0) return;
  adminStatusMode.value = "CONFIRM";
  showAdminStatus.value = true;
};

// เมื่อกดปุ่ม “ปฏิเสธคำสั่งซื้อ” ด้านบน (ปุ่มแดง)
const handleRejectSelected = () => {
  if (selectedIds.value.length === 0) return;
  adminStatusMode.value = "REJECT";
  showAdminStatus.value = true;
};

// ตอนกด “ยืนยัน” ใน popup AdminOrderStatus
const handleAdminStatusConfirm = async () => {
  if (selectedIds.value.length === 0) {
    showAdminStatus.value = false;
    return;
  }

  const status =
    adminStatusMode.value === "CONFIRM" ? "CONFIRMED" : "REJECTED";

  try {
    // ยิง API เปลี่ยนสถานะทุกอันที่เลือก
    await Promise.all(
      selectedIds.value.map((id) => updateOrderStatus(id, status))
    );

    // รีเฟรชรายการ + เคลียร์ checkbox + ปิด popup
    await loadOrders();
    selectedIds.value = [];
    showAdminStatus.value = false;
  } catch (e) {
    console.error(e);
  }
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

