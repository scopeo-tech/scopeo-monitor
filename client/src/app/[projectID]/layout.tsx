"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import MonitoringNavbar from "../../components/layout/navbar/monitoringNavbar";
import MonitoringSidebar from "../../components/layout/sidebar/monitoringSidebar";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { connectSocket } = useNotificationStore();

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

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
