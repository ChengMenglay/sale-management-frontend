import React from "react";
import { CategoryColumn } from "./components/columns";
import { getCategories } from "@/dataFetch/categoryFetch";
import { getServerSession } from "next-auth";
import authOptions, {
  CustomSession,
} from "@/app/api/auth/[...nextauth]/authOption";
import CategoryClient from "./components/client";
export default async function Category() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const categories = await getCategories(session?.user?.token as string);
  const formattedCategoryColumn: CategoryColumn[] = categories.data.map(
    (category: any) => ({
      id: category.id,
      name: category.name,
      created_at: category.created_at,
    })
  );
  return (
    <div className="flex-col">
      {" "}
      <div className="flex-1">
        <CategoryClient categories={formattedCategoryColumn} />
      </div>
    </div>
  );
}
