"use client";
import NoResult from "@/components/NoResult";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useCart from "@/hooks/use-cart";
import { formatter } from "@/lib/utils";
import { Trash, XCircleIcon } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Product } from "../../../../../../type";
import { toast } from "react-toastify";

export default function CartStore() {
  const { items, removeAll, removeItem } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const subTotal = useMemo(
    () =>
      items.reduce((acc, item) => {
        return acc + Number(item.price) * (quantities[item.id] || 1);
      }, 0),
    [items, quantities]
  );

  const totalTax = useMemo(
    () =>
      items
        .reduce((acc, item) => {
          return acc + Number(item.tax) * (quantities[item.id] || 1);
        }, 0)
        .toFixed(2),
    [items, quantities]
  );

  const total = useMemo(
    () => subTotal + Number(totalTax),
    [subTotal, totalTax]
  );
  useEffect(() => {
    setQuantities((prev) =>
      items.reduce(
        (acc, item) => ({ ...acc, [item.id]: prev[item.id] || 1 }),
        {}
      )
    );
  }, [items]);
  const updateQuantity = useCallback(
    (id: number, delta: number, product: Product) => {
      setQuantities((prev) => {
        const currentQty = prev[id] || 1;
        const newQty = currentQty + delta;
        if (newQty > product.stock) {
          toast.info("Product out of stock!");
          return prev;
        }
        return newQty < 1 ? prev : { ...prev, [id]: newQty };
      });
    },
    [setQuantities]
  );

  return (
    <div className="grid grid-rows-12 gap-2 h-full">
      <div className="row-span-8 flex flex-col">
        <div className="flex justify-between sticky top-0 z-10 bg-white dark:bg-gray-900">
          <div></div>
          <h1 className="text-center font-bold ">
            Cart Detail {`(${items.length})`}
          </h1>
          {items.length > 0 ? (
            <Button
              onClick={() => {
                removeAll();
                setQuantities({});
              }}
              variant={"destructive"}
              size={"icon"}
            >
              <Trash className="w-3 h-3" />
            </Button>
          ) : (
            <div></div>
          )}
        </div>
        <Separator className="my-2" />
        <div className="flex-grow overflow-y-auto  space-y-1">
          {items.length > 0 ? (
            items.map((item) => (
              <Card
                key={item.id}
                className="grid grid-cols-1 gap-2 p-2 relative"
              >
                <div className="grid grid-cols-12 gap-2 items-center sm:p-3 p-1">
                  <div className="col-span-8 flex md:space-x-2 gap-2">
                    {/* Image Section */}
                    <div className="relative w-[60px] h-[60px] flex-shrink-0">
                      <Image
                        alt={item.name}
                        src={item.image}
                        fill
                        className="object-contain rounded"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    {/* Product Details with Truncated Name */}
                    <div className="flex flex-col min-w-0 space-y-2">
                      <p className="sm:text-sm text-md truncate w-full">
                        {item.name}
                      </p>
                      <p className="text-red-500 md:text-md text-sm font-bold">
                        {formatter.format(Number(item.price))}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-4 flex justify-center">
                    <div className="flex border rounded-md space-x-3 p-2">
                      <span
                        className="cursor-pointer text-lg"
                        onClick={() => updateQuantity(item.id, -1, item)}
                      >
                        -
                      </span>
                      <span className="text-lg">{quantities[item.id]}</span>
                      <span
                        className="cursor-pointer text-lg"
                        onClick={() => updateQuantity(item.id, 1, item)}
                      >
                        +
                      </span>
                    </div>
                    <div
                      onClick={() => {
                        removeItem(item.id);
                        setQuantities((prev) => {
                          const updateQuantity = { ...prev };
                          delete updateQuantity[item.id];
                          return updateQuantity;
                        });
                      }}
                      className="cursor-pointer absolute top-2 right-2"
                    >
                      <XCircleIcon className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="mt-4">
              <NoResult />
            </div>
          )}
        </div>
      </div>
      <div className="row-span-4 h-full p-2 flex flex-col justify-between ">
        <Separator className="my-2" />
        <div className="bg-gray-100 p-4 rounded-xl relative before:content-[''] before:w-5 before:h-5 before:rounded-full before:bg-white before:absolute before:-left-2 before:top-1/2 before:-translate-y-1/2 after:content-[''] after:w-5 after:h-5 after:rounded-full after:bg-white after:absolute after:-right-2 after:top-1/2 after:-translate-y-1/2">
          <ul className="space-y-1">
            <li className="flex justify-between items-center">
              <span className="font-semibold">Subtotal:</span>
              <span>{formatter.format(subTotal)}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="font-semibold">Tax:</span>
              <span>{formatter.format(Number(totalTax))}</span>
            </li>
            <li className="border-t border-gray-300 pt-3 flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>{formatter.format(Number(total))}</span>
            </li>
          </ul>
        </div>
        <Button variant={"default"}>Continue to Payment</Button>
      </div>
    </div>
  );
}
