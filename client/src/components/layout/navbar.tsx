"use client"

import Link from "next/link";
import { FC } from "react";
import { useUserStore } from "@/lib/stores/userStore";
import { useRouter } from "next/navigation";
const Navbar: FC = () => {
  const {user}= useUserStore();
  const router = useRouter();
  return (
    <nav className="flex items-center justify-between px-10 py-3 bg-white border-b shadow-sm ">
      {/* Logo */}
      <div className="flex items-center " onClick={() => router.push("/home")}>
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="white" 
            className="w-5 h-5"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </div>
        <span className="ml-2 text-2xl font-semibold font-sans text-emerald-500">Scopeo</span>
      </div>

      
      <div className="hidden md:flex items-center space-x-12">
        <Link href="#" className="text-gray-600 hover:text-gray-900">Developers</Link>
        <Link href="#" className="text-gray-600 hover:text-gray-900">Documentation</Link>
        <Link href="#" className="text-gray-600 hover:text-gray-900">About Us</Link>
        <Link href="#" className="text-gray-600 hover:text-gray-900">Contact</Link>
      </div>
      {user ? (
        <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full text-lg ">
          {user.username[0].toUpperCase()}
        </div>
      ) : (
        <Link href="/auth/login">
          <button className="bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors">
            Sign In
          </button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
