import React from "react";
import Sale from "./components/Sale";
import authOptions, {
  CustomSession,
} from "@/app/api/auth/[...nextauth]/authOption";
import { getServerSession } from "next-auth";
import { getProducts } from "@/dataFetch/ProductFetch";
import { getCategories } from "@/dataFetch/categoryFetch";
import { Product } from "../../../../../type";
export default async function SalePage() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const products = await getProducts(session?.user?.token as string);
  const filteredProducts = products.data.filter(
    (item: Product) => item.stock > 0
  );
  const categories = await getCategories(session?.user?.token as string);
  return (
    <div className="grid md:grid-cols-12 grid-rows-12 gap-2 md:h-[80vh]">
      <Sale products={filteredProducts} categories={categories.data} />
    </div>
  );
}
