"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "./ui/theme-provider";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        enableColorScheme
      >
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          className={"z-50"}
        />
        <NextTopLoader />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
