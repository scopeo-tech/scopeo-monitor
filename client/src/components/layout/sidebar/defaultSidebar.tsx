"use client"


import { useQuery } from "@tanstack/react-query";
import { getUserInfo, logoutUser } from "@/lib/api";
import { FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
// import { userDetails } from "@/lib/interface";


const Sidebar = () => {
    const { data: user, isLoading, isError } = useQuery({
      queryKey: ["userInfo"],
      queryFn: getUserInfo,
    });

    const handleLogout =async () => {
        await logoutUser()
        window.location.reload()
    }

    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>Error</div>

    return (
        <div className="w-64 bg-green-400 text-white h-[calc(100vh-64px)] p-4 fixed left-0 top-16 shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Scopeo</h1>
        <button className="text-sm text-white hover:underline flex items-center justify-center">
          Create new project ✏
        </button>
      </div>

      {user && (
        <div className="mt-6 p-3 bg-white text-black rounded-lg shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-pink-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
              {user?.username[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?user.username:"user Name"}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <p className="mt-3 text-sm">
            <strong>Joined on:</strong> {user?user.joinedDate:"Joined Date"}
          </p>
          <p className="text-sm">
            <strong>Total Projects:</strong> {user?user.totalProjects:"Total Projects"}
          </p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <button className="flex items-center space-x-2 text-white hover:text-gray-200">
          <FaCog />
          <span>Settings</span>
        </button>
        <button className="flex items-center space-x-2 text-white hover:text-gray-200">
          <FaQuestionCircle />
          <span>Get Help</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-white hover:text-gray-200"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar