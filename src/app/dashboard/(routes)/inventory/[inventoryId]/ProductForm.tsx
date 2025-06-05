"use client";
import React, { useState } from "react";
import { Category, Product } from "../../../../../../type";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axios";
import { toast } from "react-toastify";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import ImageUpload from "@/components/ui/image-upload";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScanBarcode, X } from "lucide-react";
import ScannerPage from "@/components/Scanner";

type ProductFormProps = {
  initialData: Product | null;
  categories: Category[] | null;
};
const formScema = z.object({
  name: z.string().min(1, {
    message: "Product name must be required!",
  }),
  image: z.string().min(1, { message: "Image must be uploaded!" }),
  price: z.coerce.number(),
  stock: z.coerce.number(),
  tax: z.coerce.number(),
  detail: z.string().min(1, { message: "Detail must be uploaded!" }),
  barcode: z.string().min(1, { message: "Barcode must be required!" }),
  status: z.boolean().default(false),
  category_id: z.string().min(1, "Category is required!"),
});
type ProductFormValue = z.infer<typeof formScema>;
export default function ProductForm({
  initialData,
  categories,
}: ProductFormProps) {
  const form = useForm<ProductFormValue>({
    resolver: zodResolver(formScema),
    defaultValues: initialData
      ? {
          ...initialData,
          detail: initialData.detail === null ? "" : initialData.detail,
          status: initialData.status === "1" ? true : false,
          category_id: String(initialData.category_id),
        }
      : {
          name: "",
          image: "",
          price: 0,
          tax: 0,
          stock: 0,
          detail: "",
          status: false,
          category_id: "",
          barcode: "",
        },
  });

  const title = initialData ? "Update Product" : "Create Product";
  const subtitle = initialData ? "Edit a product" : "Add a product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const toastMessageError = initialData
    ? "Fails product updating!"
    : "Fails product creation.";
  const action = initialData ? "Save changes" : "Create";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const onSubmitted = async (data: ProductFormValue) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axiosClient
          .put(`/product/${initialData.id}`, {
            ...initialData,
            name: data?.name,
            image: data?.image,
            price: Number(data?.price),
            stock: Number(data?.stock),
            tax: Number(data?.tax),
            detail: data?.detail,
            barcode: data?.barcode,
            status: data?.status,
            category_id: Number(data?.category_id),
          })
          .then((res) => {
            if (res.data) {
              router.refresh();
              router.push("/dashboard/inventory");
              toast.success(toastMessage);
            }
          })
          .catch((error) => {
            if (error.response) {
              const errors = Object.values(error.response.data);
              // Only display the error toast without affecting the screen
              toast.error(errors[0] as string);
            }
            console.error("Error occurred:", error);
          });
      } else {
        console.log("Data: ", data);
        await axiosClient
          .post("/product", {
            name: data?.name,
            image: data?.image,
            price: Number(data?.price),
            stock: Number(data?.stock),
            tax: Number(data?.tax),
            detail: data?.detail,
            status: data?.status,
            barcode: data?.barcode,
            category_id: Number(data?.category_id),
          })
          .then((res) => {
            if (res.data) {
              router.push("/dashboard/inventory");
              router.refresh();
              toast.success(toastMessage);
            }
          })
          .catch((error) => {
            if (error.response) {
              const errors = Object.values(error.response.data);
              // Only display the error toast without affecting the screen
              toast.error(errors[0] as string);
            }

            console.log("Error occurred:", error.response);
          });
      }
    } catch (error) {
      console.log("Fails fetching data: ", error);
      // Show error toast without displaying on the screen
      toast.error(toastMessageError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarcode = (value: string) => {
    form.setValue("barcode", value);
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Header title={title} subtitle={subtitle} />
        {isScanning ? (
          <Button
            onClick={() => setIsScanning(!isScanning)}
            variant={"destructive"}
            size={"icon"}
          >
            <X />
          </Button>
        ) : (
          <Button
            onClick={() => setIsScanning(!isScanning)}
            variant={"secondary"}
            size={"icon"}
          >
            <ScanBarcode />
          </Button>
        )}
      </div>
      <div className="flex items-center justify-end">
        {isScanning && (
          <ScannerPage
            disable={isLoading}
            onChange={(value) => handleBarcode(value)}
          />
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitted)}
          className="space-y-4 text-foreground"
        >
          <div className="grid grid-cols-1">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      disable={isLoading}
                      value={field.value ? field.value : ""}
                      onChange={(url) => field.onChange(url)}
                      onDelete={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Product name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="Product stock..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="Product price..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Product tax..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className=" text-foreground">
                      <SelectValue
                        className=" text-foreground"
                        defaultValue={field.value}
                        placeholder="Select category"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        {categories?.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barcode</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Product barcode..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      className="border-white"
                      disabled={isLoading}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="Product detail..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="my-4" variant={"secondary"}>
            {isLoading && <CgSpinnerTwoAlt className=" animate-spin mr-1" />}
            <span>{isLoading ? "Loading..." : action}</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
