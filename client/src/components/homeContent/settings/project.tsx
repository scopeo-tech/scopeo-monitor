"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateProject, getUserProjects, checkProjectName ,deleteProject} from "@/lib/api";
import { Project } from "@/lib/interface";
import { FiAlertTriangle } from "react-icons/fi";

export default function ProjectPage() {
  const [selectedProject, setSelectedProject] = useState("stepprime-ecommerce");
  const [projectName, setProjectName] = useState("");
  const [passkey, setPasskey] = useState("");
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isNameTaken, setIsNameTaken] = useState<boolean | null>(null);
  const [resMessage, setResMessage] = useState("");

  const { data: projects, isLoading, isError } = useQuery<Project[]>({
    queryKey: ["userProjects"],
    queryFn: getUserProjects,
  });

  useEffect(() => {
    if (projects && projects.length > 0) {
      setSelectedProject(projects[0]._id);
    }
  }, [projects]);

  useEffect(() => {
    setIsChanged(!!projectName || !!passkey);
  }, [projectName, passkey]);


  useEffect(() => {
    if (!projectName) {
      setIsNameTaken(null);
      setResMessage("");
      return;
    }

    const delayCheck = setTimeout(async () => {
      try {
        const response = await checkProjectName(projectName);
        setIsNameTaken(response.data);
        setResMessage(response.message);
      } catch (error) {
        console.error("Error checking project name:", error);
        setIsNameTaken(true);
        setResMessage("Error checking project name");
      }
    }, 500); 

    return () => clearTimeout(delayCheck);
  }, [projectName]);

  const mutation = useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: { name: string; passKey: string } }) =>
      updateProject(projectId, data),
    onSuccess: (data) => {
      console.log("Updated Data:", data);
      setProjectName("");
      setPasskey("");

      setSelectedProject((prev) => {
        const updatedProject = projects?.find((proj) => proj._id === prev);
        return updatedProject ? data.name || updatedProject.name : prev;
      });
    },
    onError: (error) => {
      alert("Failed to update project.");
      console.error("Update Error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName && !passkey) {
      alert("Please provide at least one field to update.");
      return;
    }

    if (isNameTaken) {
      alert(resMessage);
      return;
    }

    const updateData: { name: string; passKey: string } = { name: "", passKey: "" };
    if (projectName) {
      updateData.name = projectName;
    }
    if (passkey) {
      updateData.passKey = passkey;
    }

    mutation.mutate({
      projectId: selectedProject,
      data: updateData,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      setSelectedProject(projects?.[0]?._id || ""); 
    },
    onError: (error) => {
      alert("Failed to delete project.");
      console.error("Delete Error:", error);
    },
  });
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(selectedProject);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading projects</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Project Management:</h2>

      <label className="block text-gray-700 text-sm font-medium mb-1">Project:</label>
      <select className="w-full p-2 border rounded-md mb-4" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
        {projects?.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </select>

      <label className="block text-gray-700 text-sm font-medium mb-1">Change Project Name:</label>
      <input
        type="text"
        className="w-full p-2 border rounded-md mb-2"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      {isNameTaken !== null && (
        <p className={`text-sm ${isNameTaken ? "text-red-600" : "text-green-600"}`}>
          {isNameTaken ? `❌ ${resMessage}` : `✅ ${resMessage}`}
        </p>
      )}

      <label className="block text-gray-700 text-sm font-medium mb-1">Change Passkey:</label>
      <input 
        type="password" 
        className="w-full p-2 border rounded-md mb-2" 
        value={passkey} 
        onChange={(e) => setPasskey(e.target.value)} 
      />
      {passkey && (
        <p className="text-red-600 text-sm flex items-center gap-1">
          <FiAlertTriangle/> Changing your passkey will log you out of all devices.
        </p>
      )}

    <div className="mt-2">
      <label className="text-gray-700 text-sm font-medium mr-2 mt-12">Allow Notifications</label>
      <div className="flex justify-end">
        <button
          onClick={() => setNotificationStatus(!notificationStatus)}
          className="relative w-12 h-6 rounded-full bg-gray-500 transition-colors duration-200 ease-in-out"
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
              notificationStatus ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>

      <button
        onClick={handleSubmit}
        className={`mt-4 px-4 py-2 rounded-md ${isChanged ? "bg-green-600 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
        disabled={!isChanged || mutation.isPending}
      >
        {mutation.isPending ? "Updating..." : "Save Changes"}
      </button>

      <div className="mt-8 border-t pt-4">
        <h3 className="text-lg font-semibold">Delete Project:</h3>
        <p className="text-gray-600 text-sm">
          Once deleted, this project and all its associated data will be permanently removed and cannot be recovered. Please confirm before proceeding.
        </p>
        <button 
            onClick={handleDelete}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Project"}
      </button>
      </div>
    </div>
  );
}
