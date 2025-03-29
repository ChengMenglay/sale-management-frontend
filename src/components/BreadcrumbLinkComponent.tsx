"use client";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Link from "next/link";
import React from "react";

export default function BreadcrumbLinkComponent() {
  const pathname = usePathname();

  // Split the pathname into segments and filter out empty ones
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          {/* Dynamic Breadcrumb Items */}
          {pathSegments.map((segment, index) => {
            const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={path}
                      className="dark:text-gray-400 underline dark:hover:text-gray-200"
                    >
                      {decodeURIComponent(segment)}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
