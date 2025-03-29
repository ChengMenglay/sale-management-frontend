import React from "react";
import CategoryForm from "./CategoryForm";
import authOptions, {
  CustomSession,
} from "@/app/api/auth/[...nextauth]/authOption";
import { getServerSession } from "next-auth";
import { getCategory } from "@/dataFetch/categoryFetch";
import { CategoryColumn } from "../components/columns";

export default async function CategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  // Ensure params are awaited
  const { categoryId } = await params;
  const session: CustomSession | null = await getServerSession(authOptions);
  let category: CategoryColumn | null = null;
  if (categoryId !== "new") {
    category = await getCategory(session?.user?.token as string, categoryId);
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
}
