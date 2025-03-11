"use client"
import React, { useState } from "react";
import Image from "next/image";
import { IoSettingsSharp } from "react-icons/io5";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import FloatingCircle from "./floatingCircle";
import errordash from "@/assets/errordash.png";
import accessdash from "@/assets/accessdash.jpg";
import logs from "@/assets/logs.jpg";
import health from "@/assets/health.jpeg";
import Link from "next/link";


function DashboardDemo() {
    const [activeIndex, setActiveIndex] = useState(0);

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
        <div className="w-full px-10 py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
            {/* Title Section */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-black">Powerful</h1>
                <h1 className="text-5xl text-emerald-500 font-bold mb-4">Dashboards</h1>
                <p className="font-semibold text-[#515151] max-w-xl mx-auto">
                    Visualize your server performance, security, and health with our intuitive dashboards that provide actionable insights.
                </p>
            </div>

            {/* Background Elements */}
            <FloatingCircle className="w-32 border-emerald-600 border-2 top-20 right-20 opacity-20 h-32" />
            <IoSettingsSharp className="absolute text-6xl text-emerald-700 top-40 left-20 opacity-20" />
            <div className="w-16 h-16 bg-emerald-200 rounded-md absolute top-1/3 left-1/4 opacity-20" />
            <div className="h-20 w-20 rounded-full bg-green-300 absolute bottom-20 right-1/4 opacity-30" />
            <div className="w-24 h-24 bg-emerald-700 rounded-md absolute bottom-40 left-20 opacity-10" />

            {/* Dashboard Gallery */}
            <div className="relative max-w-6xl mx-auto h-[600px]">
                {/* Main Active Dashboard */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-3/4 h-[450px] shadow-2xl rounded-lg overflow-hidden border-8 border-white transform transition-all duration-700">
                        <Image
                            src={dashboards[activeIndex].image}
                            alt={dashboards[activeIndex].title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                            priority
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <h2 className="text-2xl font-bold text-white">{dashboards[activeIndex].title}</h2>
                            <p className="text-gray-200">{dashboards[activeIndex].description}</p>
                        </div>
                    </div>
                </div>


                {dashboards.map((dashboard, index) => {

                    if (index === activeIndex) return null;


                    const positions = [
                        "bottom-[-50px] left-[10%] w-1/4 h-[180px] rotate-[-5deg]",
                        "top-[-30px] right-[15%] w-1/3 h-[200px] rotate-[3deg]",
                        "top-[35%] right-[-40px] w-1/4 h-[160px] rotate-[8deg]"
                    ];

                   
                    const positionIndex = (index - activeIndex - 1 + dashboards.length) % positions.length;

                    return (
                        <div
                            key={dashboard.id}
                            className={`absolute cursor-pointer ${positions[positionIndex]} shadow-lg border-4 border-white rounded-lg overflow-hidden z-10 transition-all duration-500 opacity-80 hover:opacity-100 hover:scale-105`}
                            onClick={() => setActiveIndex(index)}
                        >
                            <Image
                                src={dashboard.image}
                                alt={dashboard.title}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                            />
                        </div>
                    );
                })}

                {/* Navigation Buttons */}
                <button
                    className="absolute top-1/2 left-0 -translate-y-1/2 w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg z-20 transition-all duration-300"
                    onClick={prevDashboard}
                >
                    <FaArrowLeft />
                </button>
                <button
                    className="absolute top-1/2 right-0 -translate-y-1/2 w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg z-20 transition-all duration-300"
                    onClick={nextDashboard}
                >
                    <FaArrowRight />
                </button>

                {/* Indicator Dots */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {dashboards.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-emerald-500 w-6" : "bg-gray-300"
                                }`}
                            onClick={() => setActiveIndex(index)}
                        />
                    ))}
                </div>
            </div>

           
            <div className="text-center my-20">
                <Link href="/auth/login" className="py-2 w-36 hover:w-52 hover:bg-emerald-600 transition-all duration-300 ease-out rounded-3xl bg-emerald-500 text-white">
                    See All Features
                </Link>
            </div>
        </div>
    );
}

export default DashboardDemo;