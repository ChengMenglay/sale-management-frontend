import React from "react";

export default function Header({
  title,
  subtitle,
  total,
}: {
  title: string;
  subtitle: string;
  total?: number;
}) {
  return (
    <div>
      <h1 className=" text-2xl text-foreground font-extrabold">
        {title}
        {total && ` (${total})`}
      </h1>
      <p className="text-sm text-foreground font-medium ">{subtitle}</p>
    </div>
  );
}
