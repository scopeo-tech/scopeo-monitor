"use client";
import React from "react";
import Navbar from "@/components/layout/navbar/navbar";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="pt-16 px-10">{children}</main> 
    </div>
  );
}
