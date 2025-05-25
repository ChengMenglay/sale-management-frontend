"use client";

import { Card, CardFooter } from "@/components/ui/card";
import { OrderDetail } from "../../../../type";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
type OrderDetailType = {
  orderDetails: OrderDetail[];
};

export default function Invoice({ orderDetails }: OrderDetailType) {
  const [isMounted, setIsMounted] = useState(false);
  const totalAmount = Number(orderDetails[0].order.total);
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  return (
    <Card className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <div ref={contentRef} className="w-full h-full p-6">
        {/* Header Section with Logo and Store Information */}
        <header className="text-center mb-8">
          {/* Logo and Store Name */}

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Koh Sdach 79 Mart
            </h1>
            <p className="text-sm text-gray-600">Your trusted local market</p>
          </div>
        </header>
        {/* Order Info Section */}
        <section className="mb-6 border-b pb-6">
          <div className="flex justify-between items-center gap-1">
            <div>
              <span className="flex items-center sm:text-2xl text-lg font-semibold text-gray-800">
                Invoice #{orderDetails[0].id}
                <span className="sm:text-sm text-xs text-gray-500 ml-2">
                  ({format(orderDetails[0].created_at, "MMMM dd, yyyy")})
                </span>
              </span>
              <p className="text-xs text-gray-500">
                Located in Koh Sdach Village, Cambodia
              </p>
            </div>
            <div>
              <p className="font-bold text-xl text-gray-800">
                ${totalAmount.toFixed(2)}
              </p>
              <span className="flex items-center sm:text-sm text-xs text-gray-500 ">
                Due on:{" "}
                <span className="ml-1">
                  {format(orderDetails[0].created_at, "MMMM dd, yyyy, hh:mm a")}
                </span>
              </span>
            </div>
          </div>
        </section>
        {/* Ordered Products Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Ordered Products
          </h3>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Tax
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Quantity
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Unit Price
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((detail) => (
                <tr key={detail.id} className="border-b border-gray-200">
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {detail.product.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {detail.product.tax + "%"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {detail.order_quantity}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    ${detail.price}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    ${detail.price * detail.order_quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {/* Total Price Section */}
        <section className="mt-6 border-t pt-4">
          <div className="flex flex-col justify-center items-end">
            <div className="flex items-center space-x-4">
              <p className="font-semibold text-sm text-gray-700">Discount:</p>
              <p className="font-bold text-sm text-gray-800">
                ${Number(orderDetails[0].order.discount).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-semibold text-gray-700">Total Amount:</p>
              <p className="font-bold text-xl text-gray-800">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </section>
        {/* Footer Section with Additional Info */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Thank you for shopping with Koh Sdach 79 Mart!</p>
          <p>
            For inquiries, contact us at:{" "}
            <strong>info@kohsdach79mart.com</strong>
          </p>
        </footer>
      </div>

      <CardFooter className="my-4 flex justify-between">
        <Button
          onClick={() => router.push("/dashboard/sale")}
          variant={"outline"}
        >
          New Sale
        </Button>
        <Button onClick={() => reactToPrintFn()}>Print</Button>
      </CardFooter>
    </Card>
  );
}
