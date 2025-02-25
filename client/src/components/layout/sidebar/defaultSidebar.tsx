"use client"

import { useQuery } from "@tanstack/react-query";
import { getUserInfo, logoutUser, getUserProjectCount } from "@/lib/api";
import { FC } from "react";
import { FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";

const Sidebar: FC = () => {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });

  const { data: projectCount, isLoading: countLoading, isError: countError } = useQuery({
    queryKey: ["userProjectCount"],
    queryFn: getUserProjectCount,
  });

  const handleLogout = async () => {
    await logoutUser()
    window.location.reload()
  }

  if(isLoading||countLoading) return <div>Loading...</div>
  if(isError||countError) return <div>Error</div>

  return (
    <div className="w-64 bg-emerald-400 text-white h-[calc(100vh-64px)] p-4 fixed left-0 top-16">
      <div className="text-center">
        <button className="text-sm text-white hover:underline flex items-center justify-center gap-1">
          Create new project
          <span className="text-xs">⎇</span>
        </button>
      </div>

      {user && (
        <div className="mt-6  p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full text-lg">
             {user?.username[0].toUpperCase()} 
            </div>
            <div>
              <h2 className="text-sm font-normal">{user?.username}</h2>
              <p className="text-xs opacity-80">{user.email}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm">
            <p className="flex gap-2">
              <span className="opacity-80">Joined on</span>
              <span>: {user?.joinedDate}</span>
            </p>
            <p className="flex gap-2">
              <span className="opacity-80">Total Projects</span>
              <span>: {projectCount ?? "0"}</span>
            </p>
          </div>
        </div>
      )}

      <div className="mt-48 space-y-4 p-4">
        <button className="flex items-center space-x-2 text-white hover:text-white/80">
          <FaCog />
          <span>Settings</span>
        </button>
        <button className="flex items-center space-x-2 text-white hover:text-white/80">
          <FaQuestionCircle />
          <span>Get Help</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-white hover:text-white/80"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;