import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header section */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>

      {/* Content cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4">
            <Skeleton className="h-32 w-full rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-4/5 rounded-md" />
              <Skeleton className="h-4 w-3/5 rounded-md" />
              <Skeleton className="h-4 w-2/5 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Additional content rows */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}