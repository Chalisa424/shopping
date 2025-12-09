import httpClient from "./main.service";
import type { ProductModel, ProductCreate } from "../models/product.model";

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
  const res = await httpClient.post("products", payload); // POST /api/products
  return res.data;
};

