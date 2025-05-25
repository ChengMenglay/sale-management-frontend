import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
export type OrdersColumn = {
  id: number;
  cashier: string;
  items: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  total: number;
  created_at: string;
};

export const columns: ColumnDef<OrdersColumn>[] = [
  {
    accessorKey: "cashier",
    header: ({ column }) => {
      return (
        <Button
          className=" font-extrabold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cashier
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "items",
    header: "Total Items",
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
    cell: ({ row }) => {
      const method = row.original.payment_method;
      return (
        <Badge
          className={`px-2 py-1 rounded-full text-xs font-semibold
          ${method === "Cash" ? "bg-green-200 text-green-600" : ""}
          ${method === "ABA" ? "bg-blue-200 text-blue-800" : ""}
          ${method === "Credit Card" ? "bg-purple-200 text-purple-800" : ""}
          `}
        >
          {method}
        </Badge>
      );
    },
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.original.payment_status;
      return (
        <Badge
          className={`px-2 py-1 rounded-full text-xs font-semibold
          ${status === "Paid" ? "bg-green-300 text-green-600" : ""}
          ${status === "Pending" ? "bg-yellow-300 text-yellow-900" : ""}
          ${status === "Failed" ? "bg-red-300 text-red-900" : ""}
          `}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "order_status",
    header: "Order Status",
    cell: ({ row }) => {
      const order = row.original.order_status;
      return (
        <Badge
          className={`px-2 py-1 rounded-full text-xs font-semibold
          ${order === "Completed" ? "bg-green-200 text-green-600" : ""}
          ${order === "Pending" ? "bg-yellow-200 text-yellow-800" : ""}
          ${order === "Cancelled" ? "bg-red-200 text-red-800" : ""}
          `}
        >
          {order}
        </Badge>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total amount",
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
