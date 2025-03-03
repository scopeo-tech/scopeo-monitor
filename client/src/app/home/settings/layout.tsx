"use client";

import { useState } from "react";
import ProjectPage from "@/components/homeContent/settings/project";
import ProfilePage from "@/components/homeContent/settings/profile";

export default function SettingsLayout() {
  const [activeTab, setActiveTab] = useState<"profile" | "project">("profile");

  return (
    <div className="min-h-screen p-2">
      <div className="flex border-b border-gray-300 h-10">
        <div
          className={`px-4  cursor-pointer ${
            activeTab === "profile" ? "font-semibold border-b-2 border-black" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </div>
        <div
          className={`px-4  cursor-pointer ${
            activeTab === "project" ? "font-semibold border-b-2 border-black" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("project")}
        >
          Project
        </div>
      </div>
      <div className="mt-6">
        {activeTab === "profile" ? (
         <ProfilePage/>
        ) : (
         <ProjectPage/>
        )}
      </div>
    </div>
  );
};


