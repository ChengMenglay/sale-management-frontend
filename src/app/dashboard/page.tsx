import React from "react";
import Overview from "./Overview";
import authOptions, {
  CustomSession,
} from "../api/auth/[...nextauth]/authOption";
import { getServerSession } from "next-auth";
import { getOrders } from "@/dataFetch/orderFetch";

export default async function Overviews() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const orders = await getOrders(session?.user?.token as string);
  return (
    <div>
      <Overview orders={orders} token={session?.user.token as string} />
    </div>
  );
}
