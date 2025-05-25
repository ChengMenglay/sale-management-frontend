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
  tax: number;
  qty?: number;
  detail?: string;
  status: string;
  barcode: string;
  category_id: number;
  created_at: string;
}
export interface Order {
  id: number;
  user_id: number;
  user: User;
  discount: number;
  note: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  amount_paid: number;
  total: number;
  created_at: Date;
}
export interface OrderDetail {
  id: number;
  order_id: number;
  order: Order;
  product_id: number;
  product: Product;
  price: number;
  order_quantity: number;
  created_at: Date;
}
