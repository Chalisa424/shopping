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

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export interface ProductUpdate {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}