"use client";

import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams, usePathname } from "next/navigation";
import { getProjectById, getUserInfo } from "@/lib/api";
import { Project } from "@/lib/interface";
import {
  FiBarChart2,
  FiLock,
  FiAlertTriangle,
  FiFileText,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";

const MonitoringSidebar = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  const { data: project } = useQuery<Project>({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
  });

  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });

  const menuItems = [
    { name: "Performance & Health Metrics", icon: FiBarChart2, path: `/${projectId}/performance` },
    { name: "Security & Access Monitoring", icon: FiLock, path: `/${projectId}/security` },
    { name: "Error & Issue Tracking", icon: FiAlertTriangle, path: `/${projectId}/error` },
    { name: "Logs & Activity Tracking", icon: FiFileText, path: `/${projectId}/logs` },
    { name: "Settings", icon: FiSettings, path: "/home/settings" },
    { name: "Help", icon: FiHelpCircle, path: "/home/help" },
  ];

  return (
    <div className="h-screen w-64 bg-green-400 text-white flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-full">
            <Image src="/your-logo.png" alt="Logo" width={24} height={24} className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">Scopeo</h1>
        </div>
        <p className="mt-2 text-sm">{project?.name}</p>
        <p className="text-xs text-gray-200">{project?.created?.toLocaleDateString()}</p>
      </div>

      <div className="space-y-4">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <button
            key={path}
            onClick={() => router.push(path)}
            className={`flex items-center px-3 py-2 rounded-lg ${
              pathname === path ? "bg-white text-green-600" : "text-gray-300"
            }`}
          >
            <Icon className="text-lg" />
            <p className="ml-2">{name}</p>
          </button>
        ))}
      </div>

      <div className="bg-white flex items-center p-2 rounded-lg">
        <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full text-lg">
          {user?.username[0].toUpperCase()}
        </div>
        <p className="ml-2 text-green-600">{user?.username}</p>
      </div>
    </div>
  );
};

export default MonitoringSidebar;
