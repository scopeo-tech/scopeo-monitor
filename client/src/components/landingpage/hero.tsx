"use client";
import React from "react";
import { IoMdSettings } from "react-icons/io";
import Image from "next/image";
import { motion } from "framer-motion";
import device from "@/assets/device.svg";
import cloud from "@/assets/cloud.svg";
import dashboard from "@/assets/dahsboard.svg";
import notes from "@/assets/notes.svg";
import padlock from "@/assets/padlock.svg";
import piechart from "@/assets/piechart.svg";
import sheild from "@/assets/sheild.svg";
import blockchart from "@/assets/blockchart.svg";
import FloatingCircle from "./floatingCircle";
import Link from "next/link";

function Hero() {
  return (
    <div className="w-full justify-between h-auto flex flex-col lg:flex-row relative">
      <FloatingCircle className="hidden lg:block w-24 bg-emerald-300 bottom-20 hover:w-28 hover:h-28 transition-all left-1/4 h-24" />
      
      <div className="flex w-full lg:w-[35%] h-auto lg:h-screen px-4 sm:px-6 lg:px-10 flex-col gap-5 sm:gap-7 justify-center relative py-16 lg:py-0">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center lg:text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Website Monitoring & Analytics
        </motion.h1>

        <motion.p
          className="text-[#515151] text-base sm:text-lg lg:text-xl font-semibold text-center lg:text-left"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Monitor, analyze, and optimize your deployed projects with a fully
          integrated platform. Our Project Monitoring Website helps you track
          uptime, response times, errors, and logs effortlessly. Detect issues
          faster, improve performance, and ensure seamless operations all from
          one powerful platform.
        </motion.p>

        <div className="flex justify-center lg:justify-start">
          <Link
            href="/auth/login"
            className="py-2 w-36 mt-5 text-center hover:w-full hover:bg-emerald-600 transition-all duration-300 ease-out rounded-3xl bg-emerald-500 text-white"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="w-full lg:w-[65%] h-0 lg:h-[800px] lg:rounded-bl-full overflow-hidden bg-emerald-200 relative">
        {/* Large Screen Layout */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={cloud}
              alt="cloud"
              className="absolute top-[40px] left-[150px]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src={device}
              alt="device"
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 opacity-80"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          >
            <Image
              src={dashboard}
              alt="dashboard"
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3"
              height={350}
              width={350}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
          >
            <IoMdSettings className="text-emerald-500 absolute top-[120px] left-[250px] text-6xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
          >
            <IoMdSettings className="text-emerald-500 animate-pulse absolute top-[200px] right-[150px] text-7xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
            whileHover={{ x: 3, y: -3 , opacity: 1}} 
          >
            <Image
              src={padlock}
              alt="padlock"
              className="absolute top-[90px] right-[180px]"
              width={200}
              height={200}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.3, ease: "easeOut" }}
            whileHover={{scale:1.01,opacity:1}}
          >
            <Image
              src={piechart}
              alt="piechart"
              className="absolute top-[200px] left-[200px]"
              width={100}
              height={100}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
          >
            <Image
              src={blockchart}
              alt="blockchart"
              className="absolute bottom-[300px] right-[80px]"
              width={250}
              height={250}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src={sheild}
              alt="sheild"
              className="absolute top-[190px] left-[20px]"
              width={350}
              height={350}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
          >
            <IoMdSettings className="text-emerald-600 absolute bottom-[300px] left-[300px] text-5xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src={notes}
              alt="notes"
              className="absolute right-[250px] bottom-[250px]"
              width={200}
              height={200}
            />
          </motion.div>
        </div>

        {/* Mobile Layout: No Images */}
        <div className="lg:hidden h-full bg-emerald-200"></div>
      </div>
    </div>
  );
}

export default Hero;