import httpClient from "./main.service";
import type { OrderModel } from "../models/order.model";
import type { CartModel } from "../models/cart.model";

// ดึงรายการสั่งซื้อของ user ปัจจุบัน
export const fetchMyOrders = async (): Promise<OrderModel[]> => {
  const res = await httpClient.get("orders");  // GET /api/orders
  return res.data;
};

// ดึงรายการสั่งซื้อทั้งหมด 
export const fetchAdminOrders = async (): Promise<OrderModel[]> => {
  const res = await httpClient.get("orders");
  return res.data;
};

// อัปเดตสถานะคำสั่งซื้อ
export const updateOrderStatus = async (orderId: number, status: string) => {
  const upper = status.toUpperCase();

  let apiStatus: string;
  if (upper === "CONFIRMED" || upper === "CONFIRM") {
    apiStatus = "confirm";
  } else if (upper === "REJECTED" || upper === "REJECT") {
    apiStatus = "reject";
  } else {
    // กันพลาด เผื่อเผลอส่งค่าอื่นมา
    console.error("Invalid status for admin change:", status);
    throw new Error(`Invalid status for admin change: ${status}`);
  }

  // ตาม Swagger ต้องส่ง { "status": "confirm" } หรือ { "status": "reject" }
  const res = await httpClient.put(`orders/${orderId}`, {
    status: apiStatus,
  });

  return res.data;
};


// สร้างคำสั่งซื้อ ตอน user กด "สั่งสินค้า"
export const createOrder = async (items: CartModel[]) => {
  const payload = {

    shippingAddress: "string",
    orderDetails: items.map((i) => ({
      productId: Number(i.id),  
      quantity: i.quantity,        // ใช้ชื่อว่า quantity ตาม swagger
    })),
  };

  console.log("createOrder payload:", payload); 

  const res = await httpClient.post("orders", payload); // POST /api/orders
  return res.data; 
};