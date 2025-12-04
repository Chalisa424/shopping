export type OrderStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";

export interface OrderItemModel {
  id: number;
  productId: number;
  name: string;
  category: string;
  image: string;
  quantity: number;
  price: number;
}

export interface OrderModel {
  id: number;
  orderCode: string;
  totalItems: number;      // กี่รายการ
  totalQuantity: number;   // กี่ชิ้น
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;

  // ข้อมูลลูกค้า (ฝั่ง admin ใช้)
  customerName?: string;
  customerPhone?: string;

  items: OrderItemModel[];
}