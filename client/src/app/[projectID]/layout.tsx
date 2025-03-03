"use client";
import React from "react";
import MonitoringNavbar from "../../components/layout/navbar/monitoringNavbar";
import MonitoringSidebar from "../../components/layout/sidebar/monitoringSidebar";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <MonitoringSidebar />
      <div className="flex-1 flex flex-col">
        <MonitoringNavbar />
        <main className="mt-16 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
