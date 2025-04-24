import Header from "@/components/Header";
import React from "react";
import Overview from "./Overview";

export default function Overviews() {
  return (
    <div>
      <Header title="Dashboard" subtitle="Track data for your store." />
      <Overview />
    </div>
  );
}
