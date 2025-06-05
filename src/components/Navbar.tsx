import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
