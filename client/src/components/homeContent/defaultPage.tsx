"use client";

import { FC, useState, useEffect } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { getUserProjects, getProjectPassKey } from "@/lib/api";
import { Project } from "@/lib/interface";
import CreateProjectModal from "../modal/createProjectModal";
import { FiEdit, FiEye, FiEyeOff } from "react-icons/fi";

const DefaultPage: FC = () => {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [visiblePassKeys, setVisiblePassKeys] = useState<Record<string, boolean>>({});
  const [passKeys, setPassKeys] = useState<Record<string, string>>({});
  const {user} = useAuthStore();

  const { data: projects, isLoading, isError } = useQuery<Project[]>({
    queryKey: ["userProjects"],
    queryFn: getUserProjects,
  });

 
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    setFormattedDate(today.toLocaleDateString("en-GB"));
    setDay(today.toLocaleDateString(undefined, { weekday: "long" }));
  }, []);

  const togglePassKeyVisibility = async (projectId?: string) => {
    if (!projectId) {
      console.error("Error: Project ID is missing!");
      return;
    }
  
    if (visiblePassKeys[projectId]) {
      setVisiblePassKeys((prev) => ({
        ...prev,
        [projectId]: false,
      }));
      return;
    }
  
    try {
      const passKeyData = await getProjectPassKey({ projectId });
      console.log(passKeyData)
      if (!passKeyData) {
        console.error("Error: No passKey received!");
        return;
      }
  
      setPassKeys((prev) => ({
        ...prev,
        [projectId]: passKeyData,
      }));
  
      setVisiblePassKeys((prev) => ({
        ...prev,
        [projectId]: true,
      }));
    } catch (error) {
      console.error("Failed to fetch passKey:", error);
    }
  };
  

  const getHiddenPassKey = () => "••••••••••";

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-base font-medium text-gray-700">{user?.username}&apos;s projects -</h1>
          <p className="text-sm text-gray-500">{Array.isArray(projects) ? projects.length : 0} projects</p>
        </div>
        <button
          className="text-gray-700 hover:text-gray-900 flex items-center gap-1 text-sm"
          onClick={() => setIsModalOpen(true)}
        >
          Start a new project <FiEdit className="ml-1" />
        </button>
      </div>

      {/* Project List */}
      <h2 className="mt-6 mb-4 text-base font-medium text-gray-700">Project list</h2>

      <div className="mt-3 bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <p className="p-4">Loading projects...</p>
        ) : isError ? (
          <p className="p-4 text-red-500">Error fetching projects!</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-sm">
                <th className="text-left py-4 px-4 font-medium text-gray-700">Project name</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">API Key</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Pass Key</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(projects) &&
                projects.map((project: Project) => (
                  <tr key={project._id} className="border-b text-sm hover:bg-gray-50 hover:cursor-pointer">
                    <td className="py-4 px-4 text-gray-700">{project.name}</td>
                    <td className="py-4 px-4 ml-8">
                      <span
                        className={`inline-block w-2 h-2 rounded-full hover: ${
                          project.status.connectionStatus
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{project.apiKey}</td>
                    <td className="py-4 px-4 text-gray-600 flex items-center">
                      {visiblePassKeys[project._id] ? passKeys[project._id] : getHiddenPassKey()}
                      <button
                        onClick={() => togglePassKeyVisibility(project._id)}
                        className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {visiblePassKeys[project._id] ? <FiEye size={16} /> : <FiEyeOff  size={16} />}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        <div className="absolute bottom-4 right-6 text-gray-500 text-xs text-right p-8">
          <p>{formattedDate}</p>
          <p className="capitalize">{day}</p>
        </div>
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default DefaultPage;
