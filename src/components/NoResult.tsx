import { SearchX } from "lucide-react";
import React from "react";

export default function NoResult() {
  return (
    <div className="flex justify-center items-center">
      <h1 className="text-md font-bold flex items-center">
        <SearchX className="w-5 h-5 mr-2" /> No Result Found.
      </h1>
    </div>
  );
}
