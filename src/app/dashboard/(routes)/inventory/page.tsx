import React from "react";
import { InventoryColumn } from "./components/columns";
import { getServerSession } from "next-auth";
import authOptions, {
  CustomSession,
} from "@/app/api/auth/[...nextauth]/authOption";
import InventoryClient from "./components/client";
import { getProducts } from "@/dataFetch/ProductFetch";
import { formatter } from "@/lib/utils";
export default async function Product() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const products = await getProducts(session?.user?.token as string);
  const formattedInventoryColumn: InventoryColumn[] = products.data.map(
    (product: InventoryColumn) => ({
      id: product.id,
      image: product.image,
      name: product.name,
      price: formatter.format(product.price),
      stock: product.stock,
      tax: product.tax + "%",
      category: product.category,
      detail: product.detail,
      barcode: product.barcode,
      status: product.stock === 0 ? "0" : product.status,
      created_at: product.created_at,
    })
  );
  return (
    <div className="flex-col">
      {" "}
      <div className="flex-1">
        <InventoryClient products={formattedInventoryColumn} />
      </div>
    </div>
  );
}
