"use client"

import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getProjectById,getUserInfo } from "@/lib/api";
import { useParams } from "next/navigation";
import { Project } from "@/lib/interface";
import { FiBarChart2, FiLock, FiAlertTriangle, FiFileText, FiSettings, FiHelpCircle} from "react-icons/fi";
const MonitoringSidebar=()=> {
    const { projectId } = useParams<{ projectId: string }>();
    const { data: project } = useQuery<Project>({
      queryKey: ["project", projectId],
      queryFn: () => getProjectById(projectId),
})

    const {data:user}=useQuery({
      queryKey:["userInfo"],
      queryFn:getUserInfo
    })
  return (
    <div className="h-screen w-64 bg-green-400 text-white flex flex-col justify-between p-4">
      {/* Logo & Project Name */}
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

      {/* Navigation Links */}
      <div className="space-y-4">
        <div className="bg-white text-green-600 px-3 py-2 rounded-lg flex items-center">
          <FiBarChart2 className="text-lg" />
          <p className="ml-2">Performance & Health Metrics</p>
        </div>
        <div className="text-gray-300 flex items-center">
          <FiLock className="text-lg" />
          <p className="ml-2">Security & Access Monitoring</p>
        </div>
        <div className="text-gray-300 flex items-center">
          <FiAlertTriangle className="text-lg" />
          <p className="ml-2">Error & Issue Tracking</p>
        </div>
        <div className="text-gray-300 flex items-center">
          <FiFileText className="text-lg" />
          <p className="ml-2">Logs & Activity Tracking</p>
        </div>
        <div className="text-gray-300 flex items-center">
          <FiSettings className="text-lg" />
          <p className="ml-2">Settings</p>
        </div>
        <div className="text-gray-300 flex items-center">
          <FiHelpCircle className="text-lg" />
          <p className="ml-2">Help</p>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white flex items-center p-2 rounded-lg">
        <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full text-lg ">
          {user?.username[0].toUpperCase()}
        </div>
        <p className="ml-2 text-green-600">{user?.username}</p>
      </div>
    </div>
  );
}
export default MonitoringSidebar
