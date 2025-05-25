"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { DataTable } from "@/components/ui/data-table";
import { CategoryColumn, columns } from "./columns";

export default function CategoryClient({
  categories,
}: {
  categories: CategoryColumn[];
}) {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center items-start sm:justify-between space-y-3">
        <Header
          title="Category"
          subtitle="Manage category for you store."
          total={categories.length}
        />
        <Button
          variant={"secondary"}
          onClick={() => router.push("/dashboard/category/new")}
        >
          Add New
        </Button>
      </div>
      <div className="my-4">
        <DataTable name="name" columns={columns} data={categories} />
      </div>
    </>
  );
}
