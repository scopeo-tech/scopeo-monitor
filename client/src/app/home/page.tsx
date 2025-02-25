import DefaultPage from "@/components/homeContent/defaultPage";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar/defaultSidebar";
import { FC } from "react";

const HomePage: FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="flex flex-1 pt-[56px]">
        <div className="w-1/6 fixed left-0 top-[56px] h-[calc(100vh-56px)] z-40 bg-white border-r">
          <Sidebar />
        </div>
        <div className="flex-1 ml-[16.66%] p-6 overflow-auto h-[calc(100vh-56px)]">
          <DefaultPage />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
