import React from "react";
import { OrdersColumn } from "./components/columns";
import { getServerSession } from "next-auth";
import authOptions, {
  CustomSession,
} from "@/app/api/auth/[...nextauth]/authOption";
import { getByOrderId, getOrders } from "@/dataFetch/orderFetch";
import { Order } from "../../../../../type";
import OrderClient from "./components/client";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
export default async function Orders() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const orders = await getOrders(session?.user?.token as string);
  const orderDetails = await Promise.all(
    orders.map(async (item: Order) => {
      const orderDetail = await getByOrderId(
        item.id,
        session?.user?.token as string
      );
      return orderDetail;
    })
  );
  const formattedOrdersColumn: OrdersColumn[] = orders.map(
    (order: Order, index: number) => ({
      id: order.id,
      cashier: order.user.name,
      items: orderDetails[index].length,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      order_status: order.order_status,
      total: formatter.format(order.total),
      created_at: format(order.created_at, "dd/MM/yyyy"),
    })
  );
  return (
    <div className="flex-col">
      <div className="flex-1">
        <OrderClient
          orders={formattedOrdersColumn}
          order_details={orderDetails}
        />
      </div>
    </div>
  );
}
