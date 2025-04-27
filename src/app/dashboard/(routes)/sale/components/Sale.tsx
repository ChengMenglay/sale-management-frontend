"use client";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { Category, Product } from "../../../../../../type";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, ScanBarcode, SortDescIcon } from "lucide-react";
import NoResult from "@/components/NoResult";
import CartStore from "./CartStore";
import ScannerPage from "@/components/Scanner";
import useCart from "@/hooks/use-cart";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface SaleProps {
  products: Product[] | null;
  categories: Category[] | null;
}
export default function Sale({ products, categories }: SaleProps) {
  const [filteredProducts, setFilterdProducts] = useState<Product[] | null>(
    products
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [searchProducts, setSearchProducts] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const router = useRouter();
  const onSort = (id: number | null) => {
    setSelectedCategoryId(id);
    ProductFilter(searchProducts, id);
  };
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchProducts(term);
    ProductFilter(term, selectedCategoryId);
  };
  const ProductFilter = (term: string, categoryId: number | null) => {
    if (!products) return;
    let filterdProducts = products;
    if (categoryId !== null) {
      filterdProducts = filterdProducts.filter(
        (product) => product.category_id === categoryId
      );
    }
    if (term) {
      filterdProducts = filterdProducts.filter((product) =>
        product.barcode.toLowerCase().includes(term)
      );
    }

    setFilterdProducts(filterdProducts);
  };
  const handleBarcode = (value: string) => {
    const productFilterBarcode = products?.find(
      (product) => product.barcode === value
    );
    if (productFilterBarcode) {
      addItem(productFilterBarcode as Product);
    } else {
      toast.info("Product barcode is not found!");
    }
  };
  return (
    <>
      <Card className="lg:col-span-8  md:col-span-6 md:h-[80vh] md:row-span-8 row-span-6 space-y-2 p-4 flex flex-col rounded-sm">
        <div className=" flex justify-between static md:sticky md:top-0 z-10 gap-4">
          <Input
            value={searchProducts}
            onChange={onSearch}
            placeholder="Search product barcode..."
          />
          <div className="flex items-center gap-2">
            <HoverCard>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <HoverCardTrigger asChild>
                    <Button variant={"secondary"} size={"icon"}>
                      <SortDescIcon />
                    </Button>
                  </HoverCardTrigger>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onSort(null)}>
                    All
                  </DropdownMenuItem>
                  {categories?.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => onSort(category.id)}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <HoverCardContent className="p-2 shadow-none border-[1px] border-foreground w-28">
                <h1 className="text-xs text-center">Sort Items</h1>
              </HoverCardContent>
            </HoverCard>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  onClick={() => router.push("/dashboard/inventory/new")}
                  size={"icon"}
                  variant={"secondary"}
                >
                  <Plus />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="p-2 shadow-none border-[1px] border-foreground w-28">
                <h1 className="text-xs text-center">Add new item</h1>
              </HoverCardContent>
            </HoverCard>
            <HoverCard>
              <DropdownMenu
                open={isScanning}
                onOpenChange={() => {
                  setIsScanning(!isScanning);
                  setIsLoading(!isLoading);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <HoverCardTrigger asChild>
                    <Button variant={"secondary"} size={"icon"}>
                      <ScanBarcode />
                    </Button>
                  </HoverCardTrigger>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {isScanning && (
                    <ScannerPage
                      disable={isLoading}
                      onChange={(value) => handleBarcode(value)}
                    />
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <HoverCardContent className="p-2 shadow-none border-[1px] border-foreground w-28">
                <h1 className="text-xs text-center">Scan barcode</h1>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
        <div className="overflow-y-auto flex-grow mt-2">
          {filteredProducts?.length === 0 ? (
            <div className="py-4">
              <NoResult />
            </div>
          ) : (
            <div className=" grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-4 grid-cols-3 gap-2 ">
              {filteredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </Card>
      <Card className=" lg:col-span-4 md:col-span-6 md:h-[80vh] md:row-span-4 row-span-6 flex flex-col rounded-sm p-4">
        <CartStore />
      </Card>
    </>
  );
}
