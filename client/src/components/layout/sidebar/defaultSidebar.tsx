"use client"

import { useQuery } from "@tanstack/react-query";
import { getUserInfo, logoutUser, getUserProjectCount } from "@/lib/api";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import {useState} from "react";
import {FiEdit} from "react-icons/fi";
import CreateProjectModal from "@/components/modal/createProjectModal";


const Sidebar: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
    const { data: user, isLoading, isError } = useQuery({
      queryKey: ["userInfo"],
      queryFn: getUserInfo,
    });


    const { data: projectCount, isLoading: countLoading, isError: countError } = useQuery({
      queryKey: ["userProjectCount"],
      queryFn: getUserProjectCount,
    });


    const handleLogout =async () => {
        await logoutUser()
        router.push("/")
       
    }

    const formatJoinedDate = (dateString: string) => {
      if (!dateString) return "";
      
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };


  if(isLoading||countLoading) return <div>Loading...</div>
  if(isError||countError) return <div>Error</div>

  return (
    <div className="w-64 bg-emerald-400 text-white h-[100vh] p-10 fixed left-0 top-14 pl-12">
      <div className="text-center pt-7">
        <button className="text-sm text-white hover:underline flex items-center justify-center gap-1"
        onClick={() => setIsModalOpen(true)}>
          Create new project
          <FiEdit className="ml-1" />
        </button>
      </div>

      {user && (
        <div className="mt-6  rounded-lg">
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
              <span>:{formatJoinedDate (user?.joinedDate)}</span>
            </p>
            <p className="flex gap-2">
              <span className="opacity-80">Total Projects</span>
              <span>: {projectCount ?? "0"}</span>
            </p>
          </div>
        </div>
      )}

      <div className="mt-64 space-y-4 ">
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
      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>

  );
};

export default Sidebar;