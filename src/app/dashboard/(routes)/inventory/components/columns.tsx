import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import BarcodeCell from "@/components/BarcodeCell";
export type InventoryColumn = {
  id: number;
  name: string;
  image: string;
  price: string;
  stock: number;
  tax?: number;
  detail?: string;
  status: string;
  category: string;
  barcode: string;
  categoryId: number;
  created_at: string;
};

export const columns: ColumnDef<InventoryColumn>[] = [
  {
    accessorKey: "image",
    cell: ({ row }) => (
      <Image
        alt={row.original.name}
        width={100}
        height={100}
        src={row.original.image}
        className="rounded-md"
        style={{ width: "auto", height: "auto" }}
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "tax",
    header: "Tax",
  },
  {
    accessorKey: "barcode",
    cell: ({ row }) => <BarcodeCell barcode={row.original.barcode} />,
  },
  {
    accessorKey: "status",
    cell: ({ row }) =>
      row.original.status === "1" ? (
        <Button variant={"secondary"}>Active</Button>
      ) : (
        <Button variant={"destructive"}>Disable</Button>
      ),
  },
  {
    accessorKey: "created_at",
    header: "Create Date",
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
