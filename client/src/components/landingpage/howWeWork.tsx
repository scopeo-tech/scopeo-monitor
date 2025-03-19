"use client"
import React from "react";
import { FaDownload, FaCogs, FaSyncAlt, FaEye, FaShieldAlt, FaServer } from "react-icons/fa";
import { MdOutlinePrivacyTip, MdOutlineSecurity } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { motion } from "framer-motion";

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
    <motion.div 
      className="w-full flex px-10 py-20 bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Left Title & Design Section */}
      <div className="flex flex-col w-1/3 gap-5 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-5xl font-bold text-black">How our</h1>
          <h1 className="text-5xl text-emerald-500 font-bold">service works</h1>
        </motion.div>
        
        <motion.p 
          className="font-semibold text-[#515151] w-4/5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Our monitoring system ensures security, error tracking, and performance optimization without accessing your database.
        </motion.p>

        {/* Background Security & Monitoring Icons */}
        <div className="w-full h-[600px] relative">
          {/* SVG icons with opacity animations */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ opacity: 0.6 }}
          >
            <IoSettingsSharp className="absolute text-[80px] text-emerald-700 top-5 left-[150px]" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ opacity: 0.8 }}
          >
            <FaShieldAlt className="absolute text-[60px] text-emerald-500 top-[140px] left-[50px]" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.55 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ opacity: 0.9 }}
          >
            <MdOutlineSecurity className="absolute text-[50px] text-emerald-700 top-[220px] right-[120px]" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.3 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ opacity: 0.7 }}
          >
            <FaServer className="absolute text-[55px] text-emerald-600 bottom-[100px] left-[40px]" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ opacity: 0.7 }}
          >
            <IoSettingsSharp className="absolute text-9xl text-emerald-700 bottom-[130px] right-[50px]" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ opacity: 0.8 }}
          >
            <IoSettingsSharp className="absolute text-6xl text-emerald-400 bottom-[100px] left-[80px]" />
          </motion.div>

          {/* Shape animations with various effects */}
          <motion.div 
            className="w-28 h-28 bg-emerald-200 rounded-md absolute top-32 right-20" 
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ scale: 1.1, rotate: 5, backgroundColor: "#6ee7b7" }}
          />
          
          <motion.div 
            className="w-32 h-32 bg-emerald-700 rounded-md absolute top-52 left-[100px]" 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 0.5, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ x: 10, opacity: 0.7 }}
          />
          
          <motion.div 
            className="w-48 h-20 bg-emerald-600 rounded-md absolute top-80 left-[40px]" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 0.3, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            whileHover={{ y: -10, opacity: 0.6 }}
          />
          
          <motion.div 
            className="w-28 h-28 bg-emerald-300 shadow-md rounded-md absolute top-56 right-10" 
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            whileHover={{ scale: 1.1, opacity: 0.8, rotate: 10 }}
          />
        </div>
      </div>

      {/* Right Timeline Section */}
      <div className="flex gap-10 py-8 w-2/3">
        {/* Vertical Timeline Line with Nodes */}
        <motion.div 
          className="w-1 flex flex-col justify-between py-10 h-full border-l-2 border-[#515151] relative"
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.6 }}
        >
          {steps.map((_, index) => (
            <motion.div 
              key={index} 
              className="relative h-24"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              {/* Node on the timeline */}
              <motion.div 
                className="absolute -left-2 top-10 w-3 h-3 bg-[#515151] rounded-full"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.2 + (0.1 * index) }}
                whileHover={{ scale: 1.8, backgroundColor: "#10b981" }}
              />
              {/* Horizontal connecting line */}
              <motion.div 
                className="absolute left-1 top-11 w-10 border-b-2 border-[#515151]"
                initial={{ width: 0 }}
                whileInView={{ width: 40 }}
                transition={{ duration: 0.3, delay: 0.3 + (0.1 * index) }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Steps Content Section */}
        <div className="flex flex-col justify-between gap-8 h-full w-full">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="flex items-center gap-4 p-5 bg-emerald-100 rounded-lg shadow-md"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + (0.1 * index) }}
              whileHover={{ scale: 1.03, backgroundColor: "#a7f3d0", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            >
              {/* Circular Icon Container matching your Features style */}
              <motion.div 
                className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-full bg-emerald-200"
                whileHover={{ rotate: 10, backgroundColor: "#6ee7b7", scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {step.icon}
              </motion.div>
              <div className="max-w-xl">
                <h2 className="text-lg font-bold text-black">{step.title}</h2>
                <p className="text-sm font-semibold text-gray-600">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default HowWeWork;