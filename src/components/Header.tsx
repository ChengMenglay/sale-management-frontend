import React from "react";

export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h1 className=" text-2xl text-foreground font-extrabold">{title}</h1>
      <p className="text-sm text-foreground font-medium ">{subtitle}</p>
    </div>
  );
}
