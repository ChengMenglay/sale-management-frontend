import authOptions, {
  CustomSession,
} from "@/app/api/auth/[...nextauth]/authOption";
import { getByOrderId } from "@/dataFetch/orderFetch";
import { getServerSession } from "next-auth";
import Invoice from "./Invoice";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session: CustomSession | null = await getServerSession(authOptions);
  const orderDetailData = await getByOrderId(
    Number(orderId),
    session?.user?.token as string
  );

  return (
    <div>
      <Invoice orderDetails={orderDetailData} />
    </div>
  );
}
