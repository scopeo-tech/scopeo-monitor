import DefaultPage from "@/components/homeContent/defaultPage";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar/defaultSidebar";
import { FC } from "react";

const HomePage: FC = () => {
    return (
        <div className="flex flex-col h-screen">
            {/* Top Navbar */}
            <Navbar />

            <div className="flex flex-1">
                {/* Sidebar on the left */}
                <div className="w-1/6 bg-green-200">
                    <Sidebar />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6">
                    <DefaultPage />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
