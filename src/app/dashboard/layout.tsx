import AppSidebar from "@/components/AppSidebar";
import BreadcrumbLinkComponent from "@/components/BreadcrumbLinkComponent";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Navbar />
        <div className="p-3 space-y-2">
          <BreadcrumbLinkComponent />
          <div>{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
