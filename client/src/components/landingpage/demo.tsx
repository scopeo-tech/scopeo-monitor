"use client";
import React, { useState } from "react";
import Image from "next/image";
import { IoSettingsSharp } from "react-icons/io5";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import FloatingCircle from "./floatingCircle";
import errordash from "@/assets/errordash.png";
import accessdash from "@/assets/accessdash.jpg";
import logs from "@/assets/logs.jpg";
import health from "@/assets/health.jpeg";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function DashboardDemo() {
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();

    const dashboards = [
        {
            id: 1,
            title: "Performance Analytics",
            description: "Track server metrics, response times, and system health in real-time.",
            image: accessdash,
        },
        {
            id: 2,
            title: "Error Monitoring",
            description: "Identify and diagnose issues with detailed error tracking and logs.",
            image: errordash,
        },
        {
            id: 3,
            title: "Security Dashboard",
            description: "Monitor access attempts and detect potential security threats.",
            image: health
        },
        {
            id: 4,
            title: "Resource Utilization",
            description: "Visualize CPU, memory, and storage usage across all your servers.",
            image: logs
        }
    ];

    const nextDashboard = () => {
        setActiveIndex((prev) => (prev === dashboards.length - 1 ? 0 : prev + 1));
    };

    const prevDashboard = () => {
        setActiveIndex((prev) => (prev === 0 ? dashboards.length - 1 : prev - 1));
    };

    return (
        <motion.div 
            className="w-full px-10 py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Title Section */}
            <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.h1 
                    className="text-5xl font-bold text-black"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    Powerful
                </motion.h1>
                <motion.h1 
                    className="text-5xl text-emerald-500 font-bold mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    Dashboards
                </motion.h1>
                <motion.p 
                    className="font-semibold text-[#515151] max-w-xl mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    Visualize your server performance, security, and health with our intuitive dashboards that provide actionable insights.
                </motion.p>
            </motion.div>

            {/* Background Elements */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.2 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                whileHover={{ scale: 1.2, rotate: 45 }}
                className="w-32 border-emerald-600 border-2 top-20 right-20 h-32 absolute"
            >
                <FloatingCircle className="w-full h-full" />
            </motion.div>

            <motion.div
                whileInView={{ 
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ 
                    duration: 15, 
                    ease: "linear", 
                    repeat: Infinity 
                }}
                className="absolute"
            >
                <IoSettingsSharp className="text-6xl text-emerald-700 absolute top-40 left-20" />
            </motion.div>

            <motion.div 
                className="w-16 h-16 bg-emerald-200 rounded-md absolute top-1/3 left-1/4"
                whileInView={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                whileHover={{ scale: 1.2, backgroundColor: "#10b981" }}
            />

            <motion.div 
                className="h-20 w-20 rounded-full bg-green-300 absolute bottom-20 right-1/4"
                whileInView={{ opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 5, repeat: Infinity }}
                whileHover={{ scale: 1.2, backgroundColor: "#6ee7b7" }}
            />

            <motion.div 
                className="w-24 h-24 bg-emerald-700 rounded-md absolute bottom-40 left-20"
                whileInView={{ opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 6, repeat: Infinity }}
                whileHover={{ rotate: 45 }}
            />

            {/* Dashboard Gallery */}
            <div className="relative max-w-6xl mx-auto h-[600px]">
                {/* Main Active Dashboard */}
                <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div 
                        className="relative w-3/4 h-[450px] shadow-2xl rounded-lg overflow-hidden border-8 border-white"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={dashboards[activeIndex].image}
                            alt={dashboards[activeIndex].title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                            priority
                        />
                        <motion.div 
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold text-white">{dashboards[activeIndex].title}</h2>
                            <p className="text-gray-200">{dashboards[activeIndex].description}</p>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {dashboards.map((dashboard, index) => {
                    if (index === activeIndex) return null;

                    const positions = [
                        "bottom-[-50px] left-[10%] w-1/4 h-[180px] rotate-[-5deg]",
                        "top-[-30px] right-[15%] w-1/3 h-[200px] rotate-[3deg]",
                        "top-[35%] right-[-40px] w-1/4 h-[160px] rotate-[8deg]"
                    ];

                    const positionIndex = (index - activeIndex - 1 + dashboards.length) % positions.length;

                    return (
                        <motion.div
                            key={dashboard.id}
                            className={`absolute cursor-pointer ${positions[positionIndex]} shadow-lg border-4 border-white rounded-lg overflow-hidden z-10`}
                            onClick={() => setActiveIndex(index)}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 0.8 }}
                            transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
                            whileHover={{ 
                                opacity: 1, 
                                scale: 1.05,
                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                            }}
                        >
                            <Image
                                src={dashboard.image}
                                alt={dashboard.title}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                            />
                        </motion.div>
                    );
                })}

                {/* Navigation Buttons */}
                <motion.button
                    className="absolute top-1/2 left-0 -translate-y-1/2 w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg z-20 transition-all duration-300"
                    onClick={prevDashboard}
                    whileHover={{ scale: 1.1, backgroundColor: "#059669" }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaArrowLeft />
                </motion.button>
                
                <motion.button
                    className="absolute top-1/2 right-0 -translate-y-1/2 w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg z-20 transition-all duration-300"
                    onClick={nextDashboard}
                    whileHover={{ scale: 1.1, backgroundColor: "#059669" }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaArrowRight />
                </motion.button>

                {/* Indicator Dots */}
                <motion.div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    {dashboards.map((_, index) => (
                        <motion.button
                            key={index}
                            className={`h-3 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-emerald-500 w-6" : "bg-gray-300 w-3"}`}
                            onClick={() => setActiveIndex(index)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                        />
                    ))}
                </motion.div>
            </div>

            <motion.div 
                className="text-center my-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
            >
                <motion.button
                    onClick={() => router.push("/auth/login")}
                    className="py-2 min-w-36 w-52 rounded-3xl bg-emerald-500 text-white"
                    whileHover={{ width: "24rem", backgroundColor: "#059669" }}
                    whileTap={{ scale: 0.98 }}
                >
                    See All Features
                </motion.button>
            </motion.div>
        </motion.div>
    );
}

export default DashboardDemo;