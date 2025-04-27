"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useCart from "@/hooks/use-cart";
import axiosClient from "@/lib/axios";
import { formatter } from "@/lib/utils";
import { Banknote, CreditCard, Landmark, LucideIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CgSpinnerAlt } from "react-icons/cg";
import { toast } from "react-toastify";

type PaymentType = "Cash" | "ABA" | "Credit Card";

const paymentMethod: { name: PaymentType; icon: LucideIcon }[] = [
  { name: "Cash", icon: Banknote },
  { name: "ABA", icon: Landmark },
  { name: "Credit Card", icon: CreditCard },
];

export default function OrderDetail() {
  const { data: session } = useSession();
  const { items, discount, note, removeAll } = useCart();
  const [selectedPayment, setSelectedPayment] = useState<PaymentType>("Cash");
  const [paidMoney, setPaidMoney] = useState("");
  const [currency, setCurrency] = useState<"dollar" | "riel">("dollar");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const subTotal = items.reduce(
    (acc, item) => acc + item.price * Number(item.qty),
    0
  );
  const totalTax = items.reduce(
    (acc, item) => acc + Number(item.tax) * Number(item.qty),
    0
  );
  const subtotalWithTax = subTotal + totalTax;

  const discountAmount =
    discount?.type === "percent"
      ? Math.min(100, Math.max(0, discount.value * subTotal))
      : discount?.value ?? 0;

  const total = subtotalWithTax - discountAmount;
  const riel = 4100;

  const paid = Number(paidMoney) || 0;
  const paidInDollar = currency === "riel" ? paid / riel : paid;
  const change = Math.max(Number((paidInDollar - Number(total)).toFixed(2)), 0);

  const totalInRiel = Math.round((total * riel) / 100) * 100;
  const handlePaymentProcessing = async () => {
    try {
      setLoading(true);
      const isFullyPaid = paidInDollar >= Number(total.toFixed(2));
      const payload = {
        user_id: session?.user?.id,
        discount: Number(discountAmount) || 0,
        note: note || "",
        payment_method: selectedPayment,
        payment_status: isFullyPaid ? "Paid" : "Partial",
        order_status: isFullyPaid ? "Completed" : "Pending",
        amount_paid: Number(paidInDollar),
        total: Number(total.toFixed(2)),
      };
      const order = await axiosClient.post("/orders", payload);
      if (order.status === 201) {
        try {
          await Promise.all(
            items.map((item) =>
              axiosClient
                .post("/order_details", {
                  order_id: order.data.data.id,
                  product_id: item.id,
                  price: item.price,
                  order_quantity: item.qty,
                })
                .catch((error) => {
                  console.log("Failed to create order_detail", error);
                  toast.error("Failed to create order_detail");
                })
            )
          );
          await Promise.all(
            items.map((item) =>
              axiosClient.put(`/product/${item.id}`, {
                ...item,
                stock: Number(item.stock - Number(item?.qty)),
              })
            )
          );
          toast.success("Payment processed and order created!");
          removeAll(); // Clear cart on success
          router.push(`/order/${order.data.data.id}`);
        } catch (detailError) {
          // If order details fail, delete the order to maintain consistency
          // await axiosClient.delete(`/orders/${order.data.data.id}`);
          toast.error("Failed to create order items");
        }
      }
    } catch (error) {
      console.log(error);
      toast.warning("Something went wrong, cannot process the payment!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="grid grid-cols-1 sm:grid-cols-12 gap-4 h-full">
      {/* Summary Panel */}
      <div className="sm:col-span-5 p-4 sm:p-6 bg-gray-50 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Sale Summary</h2>
          <Separator />
        </div>

        {/* Items */}
        <div className="overflow-auto flex-1">
          <div className="hidden md:grid grid-cols-3 font-semibold border-b pb-2">
            <span>Name</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Price</span>
          </div>

          <div className="space-y-3 mt-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="md:grid md:grid-cols-3 items-center gap-2 border-b pb-2"
              >
                <div className="md:hidden">
                  <p className="font-semibold">{item.name}</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Qty: {item.qty}</span>
                    <span>{formatter.format(item.price)}</span>
                  </div>
                </div>
                <span className="hidden md:block">{item.name}</span>
                <span className="hidden md:block text-center">{item.qty}</span>
                <span className="hidden md:block text-right">
                  {formatter.format(item.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-2 text-sm sm:text-base">
          <Separator />
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatter.format(subTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatter.format(totalTax)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>
              {discountAmount > 0
                ? `- ${formatter.format(discountAmount)}`
                : "$0"}
            </span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
            <span>Order Total:</span>
            <div className="flex flex-col items-end text-right">
              <span>{formatter.format(total)}</span>
              <span className="flex items-center">
                <span>៛</span>
                <span>{totalInRiel.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Panel */}
      <div className="sm:col-span-7 p-4 sm:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Pay</h2>
          <Button variant="secondary" className="font-bold px-6">
            {formatter.format(total)}
          </Button>
        </div>

        {/* Payment Options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {paymentMethod.map((method) => (
            <div
              key={method.name}
              onClick={() => setSelectedPayment(method.name)}
              className={`flex items-center justify-center gap-2 border rounded-lg p-3 cursor-pointer transition ${
                selectedPayment === method.name
                  ? "bg-gray-200 border-gray-300"
                  : "border-gray-200"
              }`}
            >
              <method.icon className="w-5 h-5" />
              <span>{method.name}</span>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 p-4 rounded-md space-y-3">
          <Label htmlFor="cash-input">Customer Paid</Label>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  {currency === "dollar" ? "$" : "៛"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCurrency("dollar")}>
                  Dollar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency("riel")}>
                  Riel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              id="cash-input"
              type="number"
              min={0}
              className="bg-white"
              value={paidMoney}
              onChange={(e) => setPaidMoney(e.target.value)}
            />
          </div>
          {paidMoney && paidInDollar < Number(total.toFixed(2)) && (
            <p className="text-red-500 text-sm">Insufficient payment amount.</p>
          )}
          <h1 className="text-xs text-gray-500">1$=4100៛</h1>
        </div>
        {/* Change */}
        <div className="border rounded-lg p-4 text-center">
          <span className="text-sm">Change Money: </span>
          <span className="font-semibold">
            {currency === "dollar"
              ? `$${change.toFixed(2)}`
              : `៛${(
                  Math.round((change * riel) / 100) * 100
                ).toLocaleString()}`}
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Sale
          </Button>
          <Button
            disabled={
              paid <
              (currency === "dollar" ? Number(total.toFixed(2)) : totalInRiel)
            }
            onClick={handlePaymentProcessing}
          >
            {loading && <CgSpinnerAlt className=" animate-spin" />}
            {loading ? "Loading..." : " Process Payment"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
