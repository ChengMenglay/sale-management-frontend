import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  BadgeCheck,
  ChevronsUpDown,
  Grid2X2Plus,
  PackageSearch,
  ShoppingCart,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getServerSession, Session } from "next-auth";
import authOptions, {
  CustomUser,
} from "@/app/api/auth/[...nextauth]/authOption";
import { Button } from "./ui/button";
import Signout from "./Signout";
import { Separator } from "./ui/separator";

const items = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: PackageSearch,
  },
  {
    title: "Sale",
    url: "/dashboard/sale",
    icon: ShoppingCart,
  },
  {
    title: "Inventory",
    url: "/dashboard/inventory",
    icon: PackageSearch,
  },
  {
    title: "Category",
    url: "/dashboard/category",
    icon: Grid2X2Plus,
  },
];
export default async function AppSidebar() {
  const session = (await getServerSession(authOptions)) as Session;
  const user = session?.user ? (session.user as CustomUser) : null;
  return (
    <Sidebar className="bg-background border rounded-lg overflow-hidden">
      <SidebarContent className="bg-background text-foreground py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg text-center text-foreground font-bold">
            Koh Sdach 79 Mart
          </SidebarGroupLabel>
          <SidebarGroupContent className="my-4">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="h-14" size={"lg"} asChild>
                    <a href={item.url} className="space-x-2">
                      <item.icon style={{ width: "20px", height: "20px" }} />
                      <span className="text-lg">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className=" bg-background">
        <Separator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size={"lg"}
                  className="w-full h-16 data-[state=open]:bg-slidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="w-10 h-10 rounded-lg">
                    <AvatarImage src={user?.profile_image || ""} alt="shoes" />
                    <AvatarFallback className="rounded-lg bg-background text-foreground">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-md leading-tight">
                    <span className=" truncate font-semibold text-foreground">
                      {user?.name}
                    </span>
                    <span className="truncate text-sm  text-foreground">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radox-dropdown-menu-trigger-width] min-w-56 rounded-lg dark:bg-neutral-600 text-foreground"
                align="end"
                side="top"
                sideOffset={20}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 p-4">
                    <Avatar className="w-10 h-10 rounded-lg">
                      <AvatarImage
                        src={user?.profile_image || ""}
                        alt="shoes"
                      />
                      <AvatarFallback className="rounded-lg bg-background">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-md leading-tight">
                      <span className=" truncate font-semibold">
                        {user?.name}
                      </span>
                      <span className="truncate text-sm ">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className=" cursor-pointer">
                  <Signout
                    className="w-full h-full flex space-x-4 items-center"
                    name="Log out"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
