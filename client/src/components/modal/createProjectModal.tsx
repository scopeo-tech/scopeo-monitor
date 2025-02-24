"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiKey, getPassKey, createProject } from "@/lib/api";
import { AiOutlineClose } from "react-icons/ai";


interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [notificationStatus, setNotificationStatus] = useState(false);
  const queryClient = useQueryClient();

  // Fetch API Key
  const { data: apiData, refetch: fetchApiKey, isFetching: apiLoading } = useQuery<{ data: string }>({
    queryKey: ["apiKey"],
    queryFn: getApiKey,
    enabled: false, 
   
  });

  // Fetch Pass Key
  const { data: passData, refetch: fetchPassKey, isFetching: passLoading } = useQuery<{ data: string }>({
    queryKey: ["passKey"],
    queryFn: getPassKey,
    enabled: false, 
    
  });

  // Mutation for creating a project
  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      console.log("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
    onError: (error: any) => {
      console.log(error, "Failed to create project");
    },
  });

  if (!isOpen) return null;

  // Fetch both API Key & Pass Key
  const fetchKeys = async () => {
    await fetchApiKey();
    await fetchPassKey();
   console.log(apiData, passData);
   
  };

  const handleSubmit = () => {
    if (!projectName || !apiData?.data || !passData?.data) {
      console.log("Please fill in all the fields.");
      
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
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        {/* Close Button */}
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="border p-6 rounded-md">
          {/* Project Name */}
          <div className="flex items-center gap-2 mb-3">
            <label className="w-1/3 text-gray-600">Project Name:</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border rounded px-3 py-1 flex-1"
            />
          </div>

          {/* API Key and Pass Key */}
          <div className="flex items-center gap-2 mb-3">
            <label className="w-1/3 text-gray-600">API Key:</label>
            <input
              type="text"
              value={apiData?.data || ""}
              readOnly
              className="border rounded px-3 py-1 flex-1"
            />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <label className="w-1/3 text-gray-600">Pass Key:</label>
            <input
              type="text"
              value={passData?.data || ""}
              readOnly
              className="border rounded px-3 py-1 flex-1"
            />
          </div>

          {/* Get Keys Button */}
          <button
            onClick={fetchKeys}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4"
            disabled={apiLoading || passLoading}
          >
            {apiLoading || passLoading ? "Fetching Keys..." : "Get API & Pass Key"}
          </button>

          {/* Notification Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <label className="w-1/3 text-gray-600">Notification:</label>
            <input
              type="checkbox"
              checked={notificationStatus}
              onChange={() => setNotificationStatus(!notificationStatus)}
              className="toggle-checkbox"
            />
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            onClick={handleSubmit}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
