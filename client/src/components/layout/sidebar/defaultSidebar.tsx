"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserInfo, getUserProjectCount } from "@/lib/api";
import { FC, useState } from "react";
import { FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import CreateProjectModal from "@/components/modal/createProjectModal";
import LogoutModal from "@/components/modal/logoutModal";
import Link from "next/link";

const Sidebar: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });

  const { data: projectCount, isLoading: countLoading, isError: countError } = useQuery({
    queryKey: ["userProjectCount"],
    queryFn: getUserProjectCount,
  });

  const formatJoinedDate = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (isLoading || countLoading) return <div>Loading...</div>;
  if (isError || countError) return <div>Error</div>;

  return (
    <div className="w-64 bg-emerald-400 text-white h-screen p-6  fixed left-0 top-14 ">
      <span className="flex items-center justify-center pt-7">
        <button
          className="text-sm text-white hover:underline flex items-center gap-1"
          onClick={() => setIsModalOpen(true)}
        >
          Create new project <FiEdit />
        </button>
      </span>


      {user && (
        <div className="mt-6 rounded-lg p-3">
          <div className="flex items-center w-48 gap-3 border-2 border-gray-400 rounded-3xl bg-gray-300 p-1 shadow-sm">
            <div className="w-8 h-8  bg-rose-500 text-white flex items-center justify-center rounded-full text-lg font-semibold">
              {user?.username[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-900">{user?.username}</h2>
              <p className="text-xs text-gray-700">{user.email}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm text-center">
            <p className="flex gap-2">
              <span className="opacity-80">Joined on</span>
              <span>: {formatJoinedDate(user?.joinedDate || "")}</span>
            </p>
            <p className="flex gap-2">
              <span className="opacity-80">Total Projects</span>
              <span>: {projectCount ?? "0"}</span>
            </p>
          </div>
        </div>
      )}

      <div className="mt-64 space-y-4 p-3">
        <Link href={"/home/settings/profile"}
          className="flex items-center space-x-2 text-white hover:text-white/80"
        >
          <FaCog />
          <span>Settings</span>
        </Link>
        <Link href="/home/help"
          className="flex items-center space-x-2 text-white hover:text-white/80">
          <FaQuestionCircle />
          <span>Get Help</span>
        </Link>
        <button
          onClick={() => setIsLogoutOpen(true)}
          className="flex items-center space-x-2 text-white hover:text-white/80"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
    </div>
  );
};

export default Sidebar;
