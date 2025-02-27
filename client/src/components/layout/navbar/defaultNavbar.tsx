import Image from "next/image";
import { FaBell } from "react-icons/fa";

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between bg-white px-4 py-2 shadow-md border-t-4 border-purple-500">
      <div className="flex items-center space-x-2">
        <Image src="/logo.png" alt="Logo" width={24} height={24} />
        <span className="text-green-600 font-semibold text-lg">Scopeo</span>
      </div>
      <span className="text-gray-600 text-sm">Settings</span>
      <div className="flex items-center space-x-4">
        <FaBell className="w-5 h-5 text-gray-600 cursor-pointer" />
        <div className="w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
          J
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
