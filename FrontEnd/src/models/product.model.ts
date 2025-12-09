export interface ProductModel {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  code?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
