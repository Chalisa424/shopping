import httpClient from "./main.service";
import type { OrderModel } from "../models/order.model";
import type { CartModel } from "../models/cart.model";

// ดึงรายการสั่งซื้อของ user ปัจจุบัน
export const fetchMyOrders = async (): Promise<OrderModel[]> => {
  const res = await httpClient.get("my-orders"); 
  return res.data;
};

// ดึงรายการสั่งซื้อทั้งหมด (สำหรับ admin)
export const fetchAdminOrders = async (): Promise<OrderModel[]> => {
  const res = await httpClient.get("admin/orders");
  return res.data;
};

// อัปเดตสถานะคำสั่งซื้อ (ฝั่ง admin)
export const updateOrderStatus = async (
  orderId: number,
  status: string
) => {
  const res = await httpClient.put(`admin/orders/${orderId}/status`, {
    status,
  });
  return res.data;
};

// เพิ่มฟังก์ชันสร้างคำสั่งซื้อ (user กด "สั่งสินค้า")\
export const createOrder = async (items: CartModel[]) => {
  const payload = {
    items: items.map((i) => ({
      productId: i.id,
      quantity: i.quantity,
    })),
  };

    const res = await httpClient.post("orders", payload);
  return res.data;
};