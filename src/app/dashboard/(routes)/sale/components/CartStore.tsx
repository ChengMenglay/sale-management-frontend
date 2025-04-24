"use client";
import NoResult from "@/components/NoResult";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useCart from "@/hooks/use-cart";
import { formatter } from "@/lib/utils";
import { ArrowRight, Trash, XCircleIcon } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Product } from "../../../../../../type";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { CgSpinnerTwoAlt } from "react-icons/cg";

export default function CartStore() {
  const {
    items,
    addItem,
    removeAll,
    removeAllItem,
    removeItem,
    discount,
    note,
    setDiscount,
    setNote,
    removeDiscount,
    removeNote,
  } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [discountInput, setDiscountInput] = useState<string>("");
  const [noteInput, setNoteInput] = useState<string>("");
  const [onOpenDiscount, setOpenDiscount] = useState<boolean>(false);
  const [onOpenNote, setOpenNote] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const subTotal = useMemo(
    () =>
      items.reduce((acc, item) => {
        return acc + Number(item.price) * (quantities[item.id] || 1);
      }, 0),
    [items, quantities]
  );

  const totalTax = useMemo(
    () =>
      items.reduce((acc, item) => {
        return acc + Number(item.tax) * (quantities[item.id] || 1);
      }, 0),
    [items, quantities]
  );

  const total = useMemo(() => {
    const subtotalWithTax = subTotal + Number(totalTax);

    // Ensure discount is treated as 0 if undefined/null
    const currentDiscount = discount?.value || 0;

    if (discount?.type === "percent") {
      const discountValue = subtotalWithTax * currentDiscount;
      return subtotalWithTax - discountValue;
    } else if (discount?.type === "amount") {
      return Math.max(0, subtotalWithTax - currentDiscount);
    }
    // Default case when no discount type is set
    return subtotalWithTax;
  }, [subTotal, totalTax, discount, discount?.type]);
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
  const applyDiscount = (type: "percent" | "amount") => {
    if (type === "percent") {
      // Convert percentage to decimal (e.g., 10% -> 0.1)
      const percentValue =
        Math.min(100, Math.max(0, Number(discountInput))) / 100;
      setDiscount("percent", percentValue);
    } else {
      // Fixed amount discount
      const amountValue = Math.min(
        subTotal + Number(totalTax),
        Math.max(0, Number(discountInput))
      );
      setDiscount("amount", amountValue);
    }
    setDiscountInput("");
    setOpenDiscount(false);
  };
  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Trim whitespace and check if note is not empty
    const trimmedNote = noteInput.trim();

    if (trimmedNote) {
      setNote(trimmedNote);
      setOpenNote(false);
      setNoteInput("");
    } else {
      toast.warning("Please enter a valid note");
    }
  };
  const handlePayNow = async () => {
    try {
      setIsLoading(true);
      const updatedItems = items.map((item) => {
        return { ...item, qty: quantities[item.id] };
      });
      removeAllItem();
      updatedItems.forEach((item) => addItem(item));
      router.push("/order")
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="grid grid-rows-12 gap-2 h-full">
      <div className="row-span-6 flex flex-col">
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
      <div className="row-span-6 h-full flex flex-col justify-between space-y-1">
        <div className="space-y-2 ">
          <Separator className="my-1" />
          <ul className="space-y-1">
            <li className="flex justify-between items-center p-2 rounded-sm border-t">
              <span className="font-semibold ">Subtotal:</span>
              <span>{formatter.format(subTotal)}</span>
            </li>
            <li className="flex justify-between items-center p-2 rounded-sm border-t">
              <span className="font-semibold">Tax:</span>
              <span>{formatter.format(Number(totalTax))}</span>
            </li>
            {discount?.value !== undefined && (
              <li className="flex justify-between items-center p-2 rounded-sm border-t">
                <span className="font-semibold">Discount:</span>
                <span className="flex items-center space-x-6">
                  <span>
                    {discount.type === "percent"
                      ? `${(Number(discount?.value) * 100).toFixed(0)}%`
                      : formatter.format(Number(discount?.value))}
                  </span>{" "}
                  <span
                    className=" cursor-pointer"
                    onClick={() => removeDiscount()}
                  >
                    <XCircleIcon className="text-foreground w-4 h-4" />
                  </span>
                </span>
              </li>
            )}
            {note && (
              <li className="p-2 rounded-sm border-t w-full">
                <span className="flex justify-between items-center">
                  <span className="font-semibold flex-shrink-0">Note:</span>
                  <span
                    className=" cursor-pointer"
                    onClick={() => removeNote()}
                  >
                    <XCircleIcon className="text-foreground w-4 h-4" />
                  </span>
                </span>

                <div className="w-full line-clamp-1">{note}</div>
              </li>
            )}
          </ul>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <DropdownMenu
              open={onOpenDiscount}
              onOpenChange={() => setOpenDiscount(!onOpenDiscount)}
            >
              <DropdownMenuTrigger asChild>
                <Button variant={"secondary"}>
                  {discount ? "Edit Discount" : "Add Discount"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 space-y-2 bg-background border rounded-lg shadow-md">
                {/* Display Input */}
                <input
                  type="text"
                  value={discountInput}
                  readOnly
                  className="w-full text-xl font-bold text-center border-b pb-2 outline-none"
                />

                {/* Numeric Keypad */}
                <div className="grid grid-cols-3 gap-2">
                  {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
                    <Button
                      key={num}
                      variant={"outline"}
                      className="text-xl"
                      onClick={() => setDiscountInput((prev) => prev + num)}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      // Only add decimal if there isn't one already
                      if (!discountInput.includes(".")) {
                        setDiscountInput((prev) => prev + ".");
                      }
                    }}
                    className="text-xl"
                  >
                    .
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => setDiscountInput("")}
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </Button>
                </div>

                {/* Discount Type Buttons */}
                <div className="flex justify-between mt-2">
                  <Button
                    className="w-1/2"
                    variant={"outline"}
                    onClick={() => applyDiscount("percent")}
                  >
                    % Discount
                  </Button>
                  <Button
                    className="w-1/2"
                    variant={"outline"}
                    onClick={() => applyDiscount("amount")}
                  >
                    $ Discount
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu
              open={onOpenNote}
              onOpenChange={() => setOpenNote(!onOpenNote)}
            >
              <DropdownMenuTrigger asChild>
                <Button variant={"secondary"}>
                  {note ? "Edit Note" : "Add Note"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-64 p-2 space-y-2 bg-background border rounded-lg shadow-md"
              >
                <form onSubmit={handleCreateNote} className="space-y-4">
                  <div className="space-y-1">
                    <Label>Note</Label>
                    <Input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Write your note here..."
                    />
                  </div>
                  <Button type="submit" variant={"outline"} className="w-full">
                    {note ? "Update Note" : "Add Note"}
                  </Button>
                  {note && (
                    <Button
                      type="button"
                      variant={"destructive"}
                      className="w-full"
                      onClick={() => {
                        setNoteInput("");
                        setNote("");
                        setOpenNote(false);
                        toast.info("Note removed");
                      }}
                    >
                      Remove Note
                    </Button>
                  )}
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <Button
              disabled={items.length === 0}
              variant={"default"}
              className="flex justify-between w-full py-6"
              onClick={handlePayNow}
            >
              {isLoading && <CgSpinnerTwoAlt className=" animate-spin" />}
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  <span>Pay Now</span>
                  <span className=" space-x-2 flex items-center">
                    <span>{formatter.format(Number(total))}</span>
                    <ArrowRight />
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
