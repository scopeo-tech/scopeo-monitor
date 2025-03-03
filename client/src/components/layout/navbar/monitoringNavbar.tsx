"use client"

import React from 'react'
import { FiBell } from 'react-icons/fi';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProjectById } from '@/lib/api';
import { Project } from '@/lib/interface';
import { useUserStore } from '@/lib/stores/userStore';
const MonitoringNavbar = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { data: project } = useQuery<Project>({
      queryKey: ["project", projectId],
      queryFn: () => getProjectById(projectId),
    });
    const {user}= useUserStore();
  return (
    <nav className="fixed top-0 left-64 w-[calc(87%-36px)] bg-white shadow-md flex items-center justify-between px-10 py-3">
      <div className="flex items-center">
        <span className="text-gray-600 text-lg font-semibold">{project?.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700">
          <FiBell/>
        </button>
        <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full text-lg ">
          {user?.username[0].toUpperCase()}
        </div>
      </div>
    </nav>
  );
}

export default MonitoringNavbar