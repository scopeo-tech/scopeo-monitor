import React from "react";
import { FaDownload, FaCogs, FaSyncAlt, FaEye, FaShieldAlt, FaServer } from "react-icons/fa";
import { MdOutlinePrivacyTip, MdOutlineSecurity } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

function HowWeWork() {
  const steps = [
    {
      icon: <FaDownload className="text-3xl text-emerald-700" />,
      title: "Install the Library",
      desc: "Easily install our monitoring library in your project with a simple command.",
    },
    {
      icon: <FaCogs className="text-3xl text-emerald-700" />,
      title: "Configure in Your Project",
      desc: "Set up the library with minimal configuration to start monitoring instantly.",
    },
    {
      icon: <FaSyncAlt className="text-3xl text-emerald-700" />,
      title: "Real-Time Monitoring",
      desc: "The library continuously monitors server performance and security in the background.",
    },
    {
      icon: <FaEye className="text-3xl text-emerald-700" />,
      title: "View Project Insights",
      desc: "Our platform visualizes server data, providing clear insights and reports.",
    },
    {
      icon: <MdOutlinePrivacyTip className="text-3xl text-emerald-700" />,
      title: "Privacy First",
      desc: "We never access or store your database data—only server metrics are monitored.",
    },
  ];

  return (
    <div className="w-full flex px-10 py-20 bg-white relative overflow-hidden">
      {/* Left Title & Design Section */}
      <div className="flex flex-col w-1/3 gap-5 relative">
        <div>
          <h1 className="text-5xl font-bold text-black">How our</h1>
          <h1 className="text-5xl text-emerald-500 font-bold">service works</h1>
        </div>
        <p className="font-semibold text-[#515151] w-4/5">
          Our monitoring system ensures security, error tracking, and performance optimization without accessing your database.
        </p>

        {/* Background Security & Monitoring Icons */}
        <div className="w-full h-[600px] relative">
          <IoSettingsSharp className="absolute text-[80px] text-emerald-700 top-5 left-[150px] opacity-20" />
          <div className="w-28 h-28 bg-emerald-200 rounded-md absolute top-32 right-20" />
          <div className="w-32 h-32 bg-emerald-700 rounded-md absolute top-52 left-[100px] opacity-50" />
          <div className="w-48 h-20 bg-emerald-600 rounded-md absolute top-80 left-[40px] opacity-30" />
          <div className="w-28 h-28 bg-emerald-300 shadow-md rounded-md absolute top-56 right-10 opacity-60" />
          <IoSettingsSharp className="absolute text-9xl text-emerald-700 bottom-[130px] right-[50px] opacity-40" />
          <IoSettingsSharp className="absolute text-6xl text-emerald-400 bottom-[100px] left-[80px] opacity-50" />

          {/* New Security & Monitoring Icons */}
          <FaShieldAlt className="absolute text-[60px] text-emerald-500 top-[140px] left-[50px] opacity-60" />
          <MdOutlineSecurity className="absolute text-[50px] text-emerald-700 top-[220px] right-[120px] opacity-55" />
          <FaServer className="absolute text-[55px] text-emerald-600 bottom-[100px] left-[40px] opacity-30" />
        </div>
      </div>

      {/* Right Timeline Section */}
      <div className="flex gap-10 py-8 w-2/3">
        {/* Vertical Timeline Line with Nodes */}
        <div className="w-1 flex flex-col justify-between py-10 h-full border-l-2 border-[#515151] relative">
          {steps.map((_, index) => (
            <div key={index} className="relative h-24">
              {/* Node on the timeline */}
              <div className="absolute -left-2 top-10 w-3 h-3 bg-[#515151] rounded-full" />
              {/* Horizontal connecting line */}
              <div className="absolute left-1 top-11 w-10 border-b-2 border-[#515151]" />
            </div>
          ))}
        </div>

        {/* Steps Content Section */}
        <div className="flex flex-col justify-between gap-8 h-full w-full">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4 p-5 bg-emerald-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              {/* Circular Icon Container matching your Features style */}
              <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-full bg-emerald-200">
                {step.icon}
              </div>
              <div className="max-w-xl">
                <h2 className="text-lg font-bold text-black">{step.title}</h2>
                <p className="text-sm font-semibold text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowWeWork;
