"use client";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  ListOrdered,
  Gauge,
  Percent,
  CalendarIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Order } from "../../../type";
import { cn, formatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import Header from "@/components/Header";
import { LineChartComponent } from "@/components/LineChart";
import { PaymentBarChart } from "@/components/PaymentBarChart";
type OverViewType = {
  orders: Order[];
};
export default function Overview({ orders }: OverViewType) {
  const { data: session, status } = useSession();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>();
  useEffect(() => {
    if (status === "loading" || !session?.expires) return;

    const expirationTime = new Date(session.expires).getTime();
    const currentTime = Date.now();
    const timeUntilLogout = expirationTime - currentTime;

    // Add a minimum threshold (e.g., 10 seconds)
    if (timeUntilLogout < 10000) {
      signOut({ callbackUrl: "/login" });
      return;
    }
    const timer = setTimeout(() => {
      signOut({ callbackUrl: "/login" });
    }, timeUntilLogout);

    return () => clearTimeout(timer);
  }, [session, status]);
  const filteredOrders = dateRange
    ? orders.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= dateRange.from && orderDate <= dateRange.to;
      })
    : orders;
  const totalRevenue = filteredOrders.reduce((acc, item) => {
    return acc + (Number(item.total) || 0);
  }, 0);
  const totalDisccount = filteredOrders.reduce((acc, item) => {
    return acc + (Number(item.discount) || 0);
  }, 0);
  const paidOrders = filteredOrders.filter(
    (item) => item.payment_status === "Paid"
  );
  const averageSale =
    paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  return (
    <div>
      <div className="flex justify-between items-center">
        <Header title="Dashboard" subtitle="Track data for your store." />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                " justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 w-4 h-4" />
              {dateRange?.from && dateRange?.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy")}
                </>
              ) : (
                <span>Filter by Date Range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-1">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) =>
                setDateRange(range as { from: Date; to: Date })
              }
              initialFocus
            />
            <Button
              variant={"outline"}
              onClick={() => setDateRange(undefined)}
              className="w-full"
            >
              Clear
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 my-2">
        <Card className="border p-4 space-y-4">
          <div className="flex space-x-4 items-center">
            <div className="flex justify-center items-center bg-black/5 rounded-lg p-2 text-green-400">
              <DollarSign className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-green-400">Total Revenue</h1>
          </div>
          <p className="text-3xl font-bold">{formatter.format(totalRevenue)}</p>
        </Card>
        <Card className="border p-4 space-y-4">
          <div className="flex space-x-4 items-center">
            <div className="flex justify-center items-center bg-black/5 rounded-lg p-2 text-green-400">
              <ListOrdered className="w-8 h-8" />{" "}
            </div>
            <h1 className="text-xl font-bold text-green-400">Total Orders</h1>
          </div>
          <p className="text-3xl font-bold">{paidOrders.length}</p>
        </Card>
        <Card className="border p-4 space-y-4">
          <div className="flex space-x-4 items-center">
            <div className="flex justify-center items-center bg-black/5 rounded-lg p-2 text-green-400">
              <Gauge className="w-8 h-8" />{" "}
            </div>
            <h1 className="text-xl font-bold text-green-400">Average Sale</h1>
          </div>
          <p className="text-3xl font-bold">{formatter.format(averageSale)}</p>
        </Card>
        <Card className="border p-4 space-y-4">
          <div className="flex space-x-4 items-center">
            <div className="flex justify-center items-center bg-black/5 rounded-lg p-2 text-green-400">
              <Percent className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-green-400">Total Discount</h1>
          </div>
          <p className="text-3xl font-bold">
            {formatter.format(totalDisccount)}
          </p>
        </Card>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        <LineChartComponent filteredOrders={filteredOrders} />
        <PaymentBarChart filteredData={filteredOrders} />
      </div>
    </div>
  );
}
