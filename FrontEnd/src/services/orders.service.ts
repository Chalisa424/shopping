import httpClient from "./main.service";
import type { OrderModel } from "../models/order.model";
import type { CartModel } from "../models/cart.model";



// ดึงรายการสั่งซื้อของ user ปัจจุบัน
export const fetchMyOrders = async (): Promise<OrderModel[]> => {
  const res = await httpClient.get("orders");  // GET /api/orders
  return res.data;
};

// ดึงรายการสั่งซื้อทั้งหมด (อนาคตเอาไปใช้หน้า admin ได้)
export const fetchAdminOrders = async (): Promise<OrderModel[]> => {
  const res = await httpClient.get("orders");
  return res.data;
};

// อัปเดตสถานะคำสั่งซื้อ
export const updateOrderStatus = async (orderId: number, status: string) => {
  const res = await httpClient.put(`orders/${orderId}`, { status });
  return res.data;
};

// สร้างคำสั่งซื้อ ตอน user กด "สั่งสินค้า"
export const createOrder = async (items: CartModel[]) => {
  const payload = {

    shippingAddress: "string",
    orderDetails: items.map((i) => ({
      productId: Number(i.id),     // แปลงเป็น number เผื่อ backend ใช้ int
      quantity: i.quantity,        // ต้องใช้ชื่อว่า quantity ตาม swagger
    })),
  };

  console.log("createOrder payload:", payload); 

  const res = await httpClient.post("orders", payload); // POST /api/orders
  return res.data; 
};