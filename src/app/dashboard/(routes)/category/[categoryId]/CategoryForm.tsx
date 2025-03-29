"use client";
import React, { useState } from "react";
import { Category } from "../../../../../../type";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axios";
import { toast } from "react-toastify";
import { CgSpinnerTwoAlt } from "react-icons/cg";

type CategoryFormProps = {
  initialData: Category | null;
};
const formScema = z.object({
  name: z.string().min(1),
});
type CategoryFormValue = z.infer<typeof formScema>;
export default function CategoryForm({ initialData }: CategoryFormProps) {
  const form = useForm<CategoryFormValue>({
    resolver: zodResolver(formScema),
    defaultValues: {
      name: initialData ? initialData.name : "",
    },
  });

  const title = initialData ? "Update Category" : "Create Category";
  const subtitle = initialData ? "Edit a category" : "Add a category";
  const toastMessage = initialData ? "Category updated." : "Category created.";
  const toastMessageError = initialData
    ? "Fails category updating!"
    : "Fails category creation.";
  const action = initialData ? "Save changes" : "Create";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmitted = async (data: CategoryFormValue) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axiosClient
          .put(`/category/${initialData.id}`, {
            ...initialData,
            name: data.name,
          })
          .then((res) => {
            if (res.data) {
              router.refresh();
              router.push("/dashboard/category");
              toast.success(toastMessage);
            }
          })
          .catch((error) => {
            if (error.response) {
              const errors = Object.values(error.response.data);
              toast.error(errors[0] as string);
            }

            console.log("Error occurred:", error);
          });
      } else {
        await axiosClient
          .post("/category", {
            name: data.name,
          })
          .then((res) => {
            if (res.data) {
              router.push("/dashboard/category");
              router.refresh();
              toast.success(toastMessage);
            }
          })
          .catch((error) => {
            if (error.response) {
              const errors = Object.values(error.response.data);
              toast.error(errors[0] as string);
            }

            console.log("Error occurred:", error);
          });
      }
    } catch (error) {
      console.error("Fails fetching data: ", error);
      toast.error(toastMessageError);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <Header title={title} subtitle={subtitle} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitted)}
          className="text-foreground"
        >
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
                      placeholder="Category name..."
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
