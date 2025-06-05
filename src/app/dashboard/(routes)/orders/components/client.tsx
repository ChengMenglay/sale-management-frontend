"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import { DataTable } from "@/components/ui/data-table";
import { OrdersColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { OrderDetail } from "../../../../../../type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrderClient({
  orders,
  order_details,
}: {
  orders: OrdersColumn[];
  order_details: OrderDetail[];
}) {
  const [date, setDate] = useState<Date>();
  const [paymentMethod, setPaymentMethod] = useState<string>();

  const filteredData = React.useMemo(() => {
    return orders.filter((item: OrdersColumn) => {
      const formattedSelectedDate = date ? format(date, "dd/MM/yyyy") : null;
      const itemDate = item.created_at;

      const matchesDate = !date || itemDate === formattedSelectedDate;
      const matchesPayment =
        !paymentMethod || item.payment_method === paymentMethod;

      return matchesDate && matchesPayment;
    });
  }, [date, paymentMethod, orders]);

  const handleExport = () => {
    const flatDetails = order_details.flat();
    const groupedDetails: { [key: number]: typeof flatDetails } = {};
    flatDetails.forEach((detail) => {
      if (!groupedDetails[detail.order_id]) {
        groupedDetails[detail.order_id] = [];
      }
      groupedDetails[detail.order_id].push(detail);
    });
    const header = [
      "ID",
      "Cashier",
      "Products",
      "Total Item",
      "Payment Method",
      "Payment Status",
      "Order Status",
      "Cash Recieved",
      "Total",
      "Created At",
    ];
    const rows = orders.map((order) => {
      const details = groupedDetails[order.id] || [];

      let productNames = details.map((d) => d.product.name).join(" - ");
      productNames = productNames.replace(/\s+/g, "_");
      const amountPaid = details[0]?.order?.amount_paid ?? 0;
      return [
        order.id,
        order.cashier,
        productNames,
        order.items,
        order.payment_method,
        order.payment_status,
        order.order_status,
        amountPaid,
        order.total,
        order.created_at,
      ];
    });

    const csvContent = [header, ...rows]
      .map((e) =>
        e
          .map((cell) =>
            typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center items-start sm:justify-between space-y-3">
        <Header
          title="Order List"
          subtitle="Manage order for you store."
          total={orders.length}
        />
        <div className="flex items-center space-x-1">
          <Button onClick={handleExport}>Export As CSV</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                {paymentMethod ? paymentMethod : "Pay By"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto space-y-1  ">
              <DropdownMenuItem onClick={() => setPaymentMethod("")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPaymentMethod("Cash")}>
                Cash
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPaymentMethod("ABA")}>
                ABA
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPaymentMethod("Credit Card")}>
                Credit Card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[150px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 w-4 h-4" />
                {date ? (
                  format(date, "dd, MM, yyyy")
                ) : (
                  <span>Filter by Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-1">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
              <Button
                variant={"outline"}
                onClick={() => setDate(undefined)}
                className="w-full"
              >
                Clear
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="md:my-4">
        <DataTable name="cashier" columns={columns} data={filteredData} />
      </div>
    </>
  );
}
