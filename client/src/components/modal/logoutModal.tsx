"use client";

import { useState } from "react";
import { logoutUser } from "@/lib/api";
import { useRouter } from "next/navigation";

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);


  const handleLogout = () => {
    logoutUser();  
    onClose();     
    router.push("/"); 
  };

  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    {/* Modal Content Wrapper */}
    <div className="w-80 rounded-lg shadow-lg text-center overflow-hidden">
      
      {/* Green Header */}
      <div className="bg-green-500 text-white h-28 flex items-center justify-center font-semibold relative">
  Confirm Logout
  {/* Close Button */}
  <button 
    onClick={onClose}
    className="absolute top-2 right-2 text-white text-xl"
  >
    &times;
  </button>
</div>


      {/* White Content Area */}
      <div className="bg-white p-6">
        <p className="text-gray-600">Are you sure you want to log out?</p>

        {/* Buttons */}
        <div className="flex justify-center mt-4">
         

          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-green-500 text-white  rounded-md hover:bg-green-600 transition"
          >
            Yes
          </button>
        </div>
      </div>

    </div>
  </div>
)}

    </>
  );
};

export default LogoutModal;
