"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { CustomSession } from "../api/auth/[...nextauth]/authOption";
import { toast } from "react-toastify";

export default function Overview() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session || !session.expires) return;

    const expirationTime = new Date(session.expires).getTime();
    const currentTime = new Date().getTime();
    const timeUntilLogout = expirationTime - currentTime;

    if (timeUntilLogout <= 0) {
      toast.warning("Session expired. Signing out...");
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  return <div>Overview</div>;
}
