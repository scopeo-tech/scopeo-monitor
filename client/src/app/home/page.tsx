import Sidebar from "@/components/layout/sidebar/defaultSidebar";

const HomePage = () => {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden dark:bg-gray-900 dark:text-gray-200 ">
            <Sidebar />
        </div>
    );
};

export default HomePage;