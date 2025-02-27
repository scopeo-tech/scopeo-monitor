"use client";

import { useState } from "react";

export default function ProjectPage() {
  const [project, setProject] = useState("stepprime-ecommerce");
  const [projectName, setProjectName] = useState("");
  const [passkey, setPasskey] = useState("");
  const [notifications, setNotifications] = useState(false);

  return (
    <div className="max-w-3xl mx-auto ">
      <h2 className="text-2xl font-semibold mb-4">Project Management :</h2>

      {/* Project Selector */}
      <label className="block text-gray-700 text-sm font-medium mb-1">Project:</label>
      <select
        className="w-full p-2 border rounded-md mb-4"
        value={project}
        onChange={(e) => setProject(e.target.value)}
      >
        <option value="stepprime-ecommerce">stepprime-ecommerce</option>
        <option value="new-project">New Project</option>
      </select>

      {/* Change Project Name */}
      <label className="block text-gray-700 text-sm font-medium mb-1">Change Project Name:</label>
      <input
        type="text"
        className="w-full p-2 border rounded-md mb-4"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      {/* Change Passkey */}
      <label className="block text-gray-700 text-sm font-medium mb-1">Change Passkey:</label>
      <input
        type="password"
        className="w-full p-2 border rounded-md mb-2"
        value={passkey}
        onChange={(e) => setPasskey(e.target.value)}
      />
      <p className="text-red-600 text-sm flex items-center gap-1">
        ⚠️ Changing your passkey will log you out of all devices.
      </p>

      {/* Notification Toggle */}
      <div className="flex items-center gap-2 mt-4">
        <label className="text-gray-700 text-sm font-medium">Allow Notifications</label>
        <input
          type="checkbox"
          className="toggle-checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
        />
      </div>

      {/* Save Changes Button */}
      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md">Save Changes</button>

      {/* Help Icon */}
      <div className="mt-4 flex items-center text-gray-600 cursor-pointer">
        <span className="text-xl">❓</span>
        <span className="ml-1 text-sm">Help</span>
      </div>

      {/* Delete Project Section */}
      <div className="mt-8 border-t pt-4">
        <h3 className="text-lg font-semibold">Delete Project:</h3>
        <p className="text-gray-600 text-sm">
          Once deleted, this project and all its associated data will be permanently removed and cannot be recovered.
          Please confirm before proceeding.
        </p>
        <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md">Delete Project</button>
      </div>
    </div>
  );
}
