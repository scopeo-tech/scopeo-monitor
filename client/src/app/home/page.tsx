import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar/defaultSidebar";
import { FC } from "react"
const HomePage: FC = () => {
    return (
       
        <div>
            <Navbar/>
            <Sidebar />
        </div>
    );
};

export default HomePage;