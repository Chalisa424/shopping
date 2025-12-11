import httpClient from "./main.service";
import type { ProductModel, ProductCreate } from "../models/product.model";

// รูป default เวลาไม่ใส่ลิงก์
const DEFAULT_IMAGE_URL =
  "https://placehold.co/160x160/png?text=No+Image"; // เปลี่ยนเป็นรูปของโปรเจกต์ก็ได้

// ดึงรายการสินค้า 
export const fetchAdminProducts = async (
  q: string = ""
): Promise<ProductModel[]> => {
  const params: Record<string, string> = {};
  if (q.trim() !== "") {
    params.q = q.trim();
  }

  const res = await httpClient.get("products", { params });
  return res.data;
};

// เพิ่มสินค้าใหม่
export const createProduct = async (
  payload: ProductCreate
): Promise<ProductModel> => {
  // ถ้า imageUrl ว่าง ให้ใส่รูป default ก่อนส่งไป API
  const body = {
    name: payload.name,
    description: payload.description ?? "",
    price: payload.price,
    stock: payload.stock,
    category: payload.category,
    imageUrl:
      payload.imageUrl && payload.imageUrl.trim() !== ""
        ? payload.imageUrl.trim()
        : DEFAULT_IMAGE_URL,
  };

  const res = await httpClient.post("products", body);
  return res.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await httpClient.delete(`products/${id}`); // DELETE /api/products/{id}
};
