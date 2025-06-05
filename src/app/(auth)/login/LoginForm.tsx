"use client";
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
import { CHECK_CREDENTIALS } from "@/lib/apiEndPoints";
import axiosClient from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { CgSpinnerTwoAlt } from "react-icons/cg";
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type formSchema = z.infer<typeof schema>;
export default function LoginForm() {
  const router = useRouter();
  const form = useForm<formSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "", // Set an initial value to keep it controlled
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: formSchema) => {
    try {
      setIsLoading(true);
      await axiosClient
        .post(CHECK_CREDENTIALS, data)
        .then((res) => {
          const response = res.data;

          if (response.status === 200) {
            signIn("credentials", {
              email: data.email,
              password: data.password,
              redirect: true,
              callbackUrl: "/dashboard",
            });
            router.push("/dashboard");
            router.refresh();
            toast.success("Logged in successfully");
          }
        })
        .catch((err) => {
          if (err.response?.status === 422) {
            toast.error("Server error!");
          } else if (err.response?.status == 401) {
            toast.error("Invalid credentials!");
          } else {
            toast.error("Something went wrong please try to log in again!");
          }
        });
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Server error!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className=" p-2  sm:mx-auto sm:max-w-2xl w-full ">
      <h1 className="sm:my-10 my-6 font-bold text-center sm:text-3xl text-xl">
        Sign in your account
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="sm:py-6 py-2"
                    placeholder="Email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="sm:py-6 py-2"
                    placeholder="Password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant={"secondary"} className="sm:py-6 py-2">
            {isLoading && <CgSpinnerTwoAlt className=" animate-spin" />}
            <span>{isLoading ? "Loading..." : "Login"}</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
