"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Overview() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading" || !session?.expires) return;
  
    const expirationTime = new Date(session.expires).getTime();
    const currentTime = Date.now();
    const timeUntilLogout = expirationTime - currentTime;
  
    // Add a minimum threshold (e.g., 10 seconds)
    if (timeUntilLogout < 10000) {
      signOut({ callbackUrl: "/login" });
      return;
    }
  
    const timer = setTimeout(() => {
      signOut({ callbackUrl: "/login" });
    }, timeUntilLogout);
  
    return () => clearTimeout(timer);
  }, [session, status]);

  return <div>Overview</div>;
}
