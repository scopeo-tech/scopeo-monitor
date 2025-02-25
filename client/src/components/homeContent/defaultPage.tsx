"use client"

import {FC} from "react"
import { useAuthStore } from "@/lib/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { getUserProjects } from "@/lib/api";
import { Project } from "@/lib/interface";

import { useState,useEffect } from "react";
import CreateProjectModal from "../modal/createProjectModal";


const DefaultPage: FC = () => {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [day, setDay] = useState<string>("");

    const { data: projects, isLoading, isError } = useQuery<Project[]>({
        queryKey: ["userProjects"],
        queryFn: getUserProjects,
    });
    
    
    const userName = useAuthStore((state) => state.user?.username);

    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
      const today = new Date();
      setFormattedDate(today.toLocaleDateString("en-GB")); // DD-MM-YYYY format
      setDay(today.toLocaleDateString(undefined, { weekday: "long" }));
    }, []);


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold">{userName}’s projects -</h1>
              <p className="text-gray-500">{Array.isArray(projects) ? projects.length : 0} projects</p>
            </div>
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setIsModalOpen(true)}
            >
              Start a new project ✏️
            </button>
          </div>
    
          {/* Project List */}
          <h2 className="mt-6 text-lg font-semibold">Project list</h2>
    
          <div className="mt-3 bg-white shadow-md rounded-lg p-4">
            {isLoading ? (
              <p>Loading projects...</p>
            ) : isError ? (
              <p className="text-red-500">Error fetching projects!</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Project name</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">API Key</th>
                    <th className="text-left p-2">Pass Key</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(projects) && projects.map((project: Project) => (
                    <tr key={project._id} className="border-b">
                      <td className="p-2">{project.name}</td>
                      <td className="p-2">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${
                            project.status === "green"
                              ? "bg-green-500"
                              : project.status === "yellow"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                      </td>
                      <td className="p-2">{project.apiKey}</td>
                      <td className="p-2">{project.passKey}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="absolute bottom-4 right-6 text-gray-600 text-sm text-right">
        <p>{formattedDate}</p>
        <p>{day}</p>
      </div>
          <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      );
}
export default DefaultPage