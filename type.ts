export interface User {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  token?: string | null;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
  tax:number;
  qty?: number;
  detail?: string;
  status: string;
  barcode: string;
  category_id: number;
  created_at: string;
}
