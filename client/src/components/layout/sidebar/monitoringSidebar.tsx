"use client";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
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
import Link from "next/link";

const MonitoringSidebar = () => {
  const { projectID } = useParams<{ projectID: string }>();
  const pathname = usePathname(); 

  const { data: project } = useQuery<Project>({
    queryKey: ["project", projectID],
    queryFn: async () => {
      const res = await getProjectById(projectID);
      return res;
    },
    enabled: !!projectID,
    staleTime: 1000 * 60 * 5,
  });

  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    staleTime: 1000 * 60 * 5,
  });

  const memoizedPathname = useMemo(() => pathname, [pathname]);

  const menuItems = useMemo(() => [
    { name: "Performance & Health Metrics", icon: FiBarChart2, path: `/${projectID}/health` },
    { name: "Security & Access Monitoring", icon: FiLock, path: `/${projectID}/security` },
    { name: "Error & Issue Tracking", icon: FiAlertTriangle, path: `/${projectID}/error` },
    { name: "Logs & Activity Tracking", icon: FiFileText, path: `/${projectID}/activity` },
    { name: "Settings", icon: FiSettings, path: "/home/settings/profile" },
    { name: "Help", icon: FiHelpCircle, path: "/faq" },
  ], [projectID]);

  const projectName = useMemo(() => project?.name || "Loading...", [project]);
  const username = useMemo(() => user?.username || "Guest", [user]);
  

  return (
    <div className="h-screen w-64 bg-emerald-400 text-white flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center justify-center mt-6 text-center space-x-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg 
              xmlns="https://www.figma.com/674429f3-5dd1-45ff-9d37-9d54a2a101b8" 
              viewBox="0 0 24 24" 
              fill="white" 
              className="w-5 h-5"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
          <Link href="/home" className="text-2xl font-bold">Scopeo</Link>
        </div>
        <div className="mt-6 text-center">
          <p className="mt-2 text-lg">{projectName}</p>
          <p className="text-xs text-gray-200">
            {project?.created ? new Date(project.created).toISOString().split("T")[0] : "N/A"}
          </p>
        </div>
      </div>
      <div className="space-y-5">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <Link
            key={path}
            href={path}
            className={`flex items-center px-3 py-2 rounded-lg ${memoizedPathname === path ? "bg-white text-green-600" : "text-gray-300"}`}
          >
            <Icon className="text-lg" />
            <p className="ml-2">{name}</p>
          </Link>
        ))}
      </div>
      <div className="bg-gray-300 border flex items-center p-2 rounded-3xl">
        <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full text-lg">
          {username[0].toUpperCase()}
        </div>
        <p className="ml-2 text-green-600">{username}</p>
      </div>
    </div>
  );
};

export default MonitoringSidebar;
