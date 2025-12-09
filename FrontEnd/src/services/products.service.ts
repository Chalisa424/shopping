import httpClient from "./main.service";
import type { ProductModel } from "../models/product.model";

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

