"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiKey, getPassKey, createProject } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/authStore";
import { AiOutlineClose } from "react-icons/ai";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [notificationStatus, setNotificationStatus] = useState(false);
  const queryClient = useQueryClient();
  const userName = useAuthStore((state) => state.user?.username);

  const { data: apiData, refetch: fetchApiKey, isFetching: apiLoading } = useQuery<{ data: string }>({
    queryKey: ["apiKey"],
    queryFn: getApiKey,
    enabled: false, 
  });

  const { data: passData, refetch: fetchPassKey, isFetching: passLoading } = useQuery<{ data: string }>({
    queryKey: ["passKey"],
    queryFn: getPassKey,
    enabled: false, 
  });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
    onError: (error: unknown) => {
      console.log(error, "Failed to create project");
    },
  });

  if (!isOpen) return null;

  const fetchKeys = async () => {
    await fetchApiKey();
    await fetchPassKey();
  };

  const handleSubmit = () => {
    if (!projectName || !apiData?.data || !passData?.data) {
      return;
    }
    mutation.mutate({
      name: projectName,
      apiKey: apiData.data,
      passKey: passData.data,
      notificationStatus,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-10 px-12 w-[750px]">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-center mb-10">Create New Project</h2>
          
          <div className="grid grid-cols-[120px,1fr] items-center gap-4">
            <label className="text-sm text-gray-600">Project Name</label>
            <div className="relative">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-96 px-3 py-2 border rounded-2xl"
                placeholder="Enter project name"
              />
              {projectName && (
                <div className="text-xs text-green-500 mt-1">Project name is available</div>
              )}
            </div>

            <label className="text-sm text-gray-600">Created by</label>
            <span className="text-sm text-gray-700">{userName}</span>

            <label className="text-sm text-gray-600">Created at</label>
            <span className="text-sm text-gray-700">{new Date().toLocaleDateString()}</span>

            <label className="text-sm text-gray-600">API Key</label>
            <div className="relative">
              <input
                type="text"
                value={apiData?.data || ""}
                readOnly
                className="w-96 px-3 py-2 border rounded-2xl pr-20"
              />
              <button
                onClick={fetchKeys}
                className="absolute right-8 top-1 px-3 p-2 bg-green-500 text-white text-sm rounded-2xl"
                disabled={apiLoading || passLoading}
              >
                Get API
              </button>
            </div>

            <label className="text-sm text-gray-600">Pass Key</label>
            <input
              type="text"
              value={passData?.data || ""}
              readOnly
              className="w-96 px-3 py-2 border rounded-2xl"
            />

            <label className="text-sm text-gray-600">Notification</label>
            <div className="flex justify-center ">
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
          <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={mutation.isLoading}
            className="w-96 py-2 mt-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors"
          >
            {mutation.isLoading ? "Creating..." : "Create Project"}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;