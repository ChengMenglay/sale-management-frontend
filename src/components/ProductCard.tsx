"use client";
import React from "react";
import { Product } from "../../type";
import Image from "next/image";
import { formatter } from "@/lib/utils";
import { Button } from "./ui/button";
import useCart from "@/hooks/use-cart";

interface ProductCardProps {
  product: Product | null;
}
export default function ProductCard({ product }: ProductCardProps) {
  const cart = useCart();
  const onAddToCart = () => {
    cart.addItem(product as Product);
  };
  return (
    <div
      onClick={onAddToCart}
      className=" cursor-pointer space-y-2 flex flex-col border dark:border-foreground p-2 shadow dark:shadow-foreground rounded-sm dark:bg-white"
    >
      <div className="aspect-square relative">
        <Image
          className="object-cover"
          alt={product?.name as string}
          src={product?.image as string}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="space-y-2 flex flex-col flex-1 justify-between">
        <h1 className="md:text-xs text-sm font-semibold dark:text-black truncate">
          {product?.name}
        </h1>
        <p className="font-extrabold text-red-500">
          {formatter.format(Number(product?.price))}
        </p>
      </div>
    </div>
  );
}
