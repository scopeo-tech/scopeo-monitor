"use client";

import Link from "next/link";
import { FC, useEffect, useState, useRef } from "react";
import { useUserStore } from "@/lib/stores/userStore";
import { FiUser, FiSettings, FiLogOut, FiHelpCircle } from "react-icons/fi";

const Navbar: FC = () => {
  const { user } = useUserStore();
  const path: string = user ? "/" : "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed z-50 w-full px-10 py-3 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link href={path} className="flex items-center">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-5 h-5"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
        <span className="ml-2 text-2xl font-semibold font-sans text-emerald-500">
          Scopeo
        </span>
      </Link>

      <div className="hidden md:flex font-semibold items-center space-x-12">
      {user && (
          <Link href="/home" className="text-gray-600 hover:text-gray-900">Home</Link>
        )}
        <Link href="/documentation" className="text-gray-600 hover:text-gray-900">
          Documentation
        </Link>
        <Link href="/about" className="text-gray-600 hover:text-gray-900">
          About Us
        </Link>
        <Link href="/contact" className="text-gray-600 hover:text-gray-900">
          Contact
        </Link>
        <Link href="/faq" className="text-gray-600 hover:text-gray-900">
          Faq
        </Link>
       
      </div>

      {user ? (
        <div className="relative" ref={dropdownRef}>
          <div
            className="w-8 h-8 cursor-pointer bg-rose-500 text-white flex items-center justify-center rounded-full text-lg"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {user.username[0].toUpperCase()}
          </div>
          {dropdownOpen && (
            <div className="absolute right-5 top-14 bg-white shadow-lg rounded-lg w-64 p-4">
              <div className="flex items-center space-x-3 border-b pb-3 mb-3">
                <div className="w-10 h-10 bg-rose-500 text-white flex items-center justify-center rounded-full text-lg">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-4">
              <Link href="/home/settings/profile" className="flex items-center space-x-3 text-gray-700 hover:text-gray-900">
                <FiUser className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Link href="/home/settings/project" className="flex items-center space-x-3 text-gray-700 hover:text-gray-900">
                <FiSettings className="w-5 h-5" />
                <span>Preferences</span>
              </Link>
              <Link href="/faq" className="flex items-center space-x-3 text-gray-700 hover:text-gray-900">
               <FiHelpCircle className="w-5 h-5" />
                <span>Help & Support</span>
              </Link>
              <button className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 w-full">
                <FiLogOut className="w-5 h-5" />
                <span>Log out</span>
              </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link href="/auth/login">
          <button className="bg-emerald-500 text-white cursor-pointer px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors">
            Sign In
          </button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
