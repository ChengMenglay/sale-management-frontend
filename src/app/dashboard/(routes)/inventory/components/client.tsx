"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { DataTable } from "@/components/ui/data-table";
import { InventoryColumn, columns } from "./columns";

export default function InventoryClient({
  products,
}: {
  products: InventoryColumn[];
}) {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center items-start sm:justify-between space-y-3">
        <Header title="Product" subtitle="Manage product for you store." />
        <Button
          variant={"secondary"}
          onClick={() => router.push("/dashboard/inventory/new")}
        >
          Add New
        </Button>
      </div>
      <div className="my-4">
        <DataTable name="name" columns={columns} data={products} />
      </div>
    </>
  );
}
