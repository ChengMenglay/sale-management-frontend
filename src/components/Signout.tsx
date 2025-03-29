"use client";
import { LOGOUT_URL } from "@/lib/apiEndPoints";
import axiosClient from "@/lib/axios";
import { signOut } from "next-auth/react";
import React from "react";

export default function Signout({
  name,
  className,
}: {
  className: string;
  name: string;
}) {
  const onSignOut = async () => {
    await axiosClient.post(LOGOUT_URL, {}).then((res) => {
      signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    });
  };
  return (
    <div className={`${className}`} onClick={onSignOut}>
      {name}
    </div>
  );
}
