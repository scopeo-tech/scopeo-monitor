"use client"

import React from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { MdSecurity, MdErrorOutline, MdSpeed, MdStorage } from "react-icons/md";
import Image from "next/image";
import { motion } from "framer-motion";
import login from "@/assets/login.svg";
import server from "@/assets/server.svg";
import sheildtwo from "@/assets/sheildtwo.svg";

function Features() {
  const features = [
    {
      img: <MdSecurity className="text-3xl text-emerald-700" />,
      title: "Access Monitoring",
      desc: "Monitor all login attempts, detect unusual activity, and prevent unauthorized access in real-time.",
    },
    {
      img: <MdErrorOutline className="text-3xl text-emerald-700" />,
      title: "Error Tracker",
      desc: "Automatically track server errors, identify root causes, and provide insights to help you resolve issues quickly.",
    },
    {
      img: <MdSpeed className="text-3xl text-emerald-700" />,
      title: "Performance & Health",
      desc: "Analyze server performance with real-time metrics on CPU, memory, uptime, and response times.",
    },
    {
      img: <MdStorage className="text-3xl text-emerald-700" />,
      title: "Logger",
      desc: "Store detailed logs of server activities for tracking changes, debugging, and ensuring compliance.",
    },
  ];

  return (
    <motion.div 
      className="w-full flex px-10 gap-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section */}
      <div className="flex flex-col w-1/2 justify-between gap-5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-5xl font-bold text-black">Features our service</h1>
          <h1 className="text-5xl text-emerald-500 font-bold">provides you</h1>
        </motion.div>
        
        <motion.p 
          className="font-semibold text-[#515151] w-2/3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          Our platform provides powerful monitoring tools to help you secure your system, track errors, and optimize performance efficiently.
        </motion.p>

        {/* Background Design Elements */}
        <div className="w-full h-[600px] relative flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0}}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
          >
            <IoSettingsSharp className="absolute text-[100px] text-emerald-700 top-5 left-[250px]" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0}}
            whileInView={{ opacity: 1}}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ y: -15, scale: 1.1 }}
          >
            <Image src={login} alt="login" className="bottom-[120px] absolute right-[80px] -z-10" width={250} height={250} />
          </motion.div>
          
          <motion.div 
            className="w-20 h-20 bg-emerald-200 rounded-md absolute top-20 right-40"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.2, rotate: 10, backgroundColor: "#6ee7b7" }}
          />
          
          <motion.div 
            className="w-20 h-20 bg-emerald-700 rounded-md absolute top-52 left-[250px]" 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.2, x: 10, backgroundColor: "#047857" }}
          />
          
          <motion.div 
            className="w-36 h-14 bg-emerald-600 rounded-md absolute top-70 left-[250px]" 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ y: -10, scale: 1.05, backgroundColor: "#059669" }}
          />
          
          <motion.div 
            className="w-28 h-28 bg-emerald-300 shadow-md rounded-md absolute top-36 right-20" 
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ rotate: 15, scale: 1.1, backgroundColor: "#6ee7b7" }}
          />
          
          <motion.div
            initial={{ opacity: 0}}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.2 }}
          >
            <IoSettingsSharp className="absolute text-7xl text-emerald-700 bottom-[130px] right-[130px]" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.5 }}
          >
            <IoSettingsSharp className="absolute text-3xl text-emerald-400 bottom-[140px] right-[100px]" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, }}
            whileInView={{ opacity: 1}}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ x: 10, y: -10, scale: 1.1 }}
          >
            <Image src={server} alt="server" className="bottom-[200px] left-[0px] absolute" width={250} height={250} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0}}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -20, scale: 1.05 }}
          >
            <Image src={sheildtwo} alt="sheildtwo" className="-bottom-[250px] absolute right-[150px]" width={600} height={600} />
          </motion.div>
          
          <motion.div 
            className="h-20 w-20 rounded-full bg-green-300 absolute bottom-[150px] right-[250px]" 
            initial={{ opacity: 0, scale: 0.2 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.3, backgroundColor: "#86efac" }}
          />
          
          <motion.div 
            className="w-[200px] rounded-xl p-5 h-[350px] bg-emerald-500"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ y: -15, backgroundColor: "#10b981" }}
          >
            <motion.div 
              className="w-full h-full bg-green-200"
              whileHover={{ scale: 0.95, rotate: 2, backgroundColor: "#bbf7d0" }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Right Section (Updated Layout) */}
      <div className="flex gap-10 py-36 w-auto">
        {/* Vertical Line with Nodes on the Left */}
        <motion.div 
          className="w-l flex flex-col justify-between py-10 h-full border-l-2 border-[#515151] relative"
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.4 }}
        >
          {features.map((_, index) => (
            <motion.div 
              key={index} 
              className="relative w-20 border-b-2 border-[#515151]"
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: 80 }}
              transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
            >
              {/* Node on the Left */}
              <motion.div 
                className="absolute -right-2 w-3 h-3 bg-[#515151] rounded-full"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.4 + (index * 0.1) }}
                whileHover={{ scale: 1.8, backgroundColor: "#10b981" }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Details Section on the Right */}
        <div className="flex flex-col justify-between h-full">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex items-center gap-4 p-4 bg-emerald-100 rounded-lg shadow-md"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
              whileHover={{ scale: 1.05, backgroundColor: "#a7f3d0", y: -5 }}
            >
              {/* Circular Icon Container */}
              <motion.div 
                className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-200"
                whileHover={{ rotate: 20, backgroundColor: "#6ee7b7", scale: 1.1 }}
              >
                {feature.img}
              </motion.div>
              <div className="max-w-xs">
                <h2 className="text-lg font-bold text-black">{feature.title}</h2>
                <p className="text-sm font-semibold text-gray-600">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Features;