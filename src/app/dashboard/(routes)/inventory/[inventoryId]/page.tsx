import React from "react";
import ProductForm from "./ProductForm";
import authOptions, {
  CustomSession,
} from "@/app/api/auth/[...nextauth]/authOption";
import { getServerSession } from "next-auth";
import { getProduct } from "@/dataFetch/ProductFetch";
import { Product } from "../../../../../../type";
import { getCategories } from "@/dataFetch/categoryFetch";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ inventoryId: string }>;
}) {
  // Ensure params are awaited
  const { inventoryId } = await params;
  const session: CustomSession | null = await getServerSession(authOptions);
  const categories = await getCategories(session?.user?.token as string);
  let product: Product | null = null;
  if (inventoryId !== "new") {
    product = await getProduct(session?.user?.token as string, inventoryId);
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pb-8">
        <ProductForm initialData={product} categories={categories.data} />
      </div>
    </div>
  );
}
